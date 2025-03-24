
import React, { useState, useEffect } from "react";
import { supabaseStorageService } from "@/lib/supabaseStorageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Key, Plus, Trash2, Eye, EyeOff, Copy, Check, AlertTriangle, ShieldAlert } from "lucide-react";

export function SecretsManager() {
  const [secrets, setSecrets] = useState<string[]>([]);
  const [secretName, setSecretName] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [showValue, setShowValue] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<string | null>(null);
  const [viewedSecretValue, setViewedSecretValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load all secret keys (not values)
  useEffect(() => {
    const loadSecrets = async () => {
      try {
        setLoading(true);
        const secretKeys = await supabaseStorageService.listSecrets();
        setSecrets(secretKeys);
      } catch (error) {
        console.error("Error loading secrets:", error);
        toast.error("Failed to load secrets");
      } finally {
        setLoading(false);
      }
    };

    loadSecrets();
  }, []);

  const handleAddSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretName || !secretValue) {
      toast.error("Both name and value are required");
      return;
    }

    try {
      await supabaseStorageService.saveSecret(secretName, secretValue);
      setSecrets(prev => [...prev, secretName]);
      toast.success(`Secret "${secretName}" saved successfully`);
      setSecretName("");
      setSecretValue("");
    } catch (error) {
      console.error("Error saving secret:", error);
      toast.error("Failed to save secret");
    }
  };

  const handleDeleteSecret = async (key: string) => {
    try {
      await supabaseStorageService.deleteSecret(key);
      setSecrets(prev => prev.filter(s => s !== key));
      toast.success(`Secret "${key}" deleted`);
    } catch (error) {
      console.error("Error deleting secret:", error);
      toast.error("Failed to delete secret");
    }
  };

  const handleViewSecret = async (key: string) => {
    try {
      setSelectedSecret(key);
      const value = await supabaseStorageService.getSecret(key);
      setViewedSecretValue(value);
    } catch (error) {
      console.error("Error viewing secret:", error);
      toast.error("Failed to view secret");
    }
  };

  const handleCopySecret = async () => {
    if (!viewedSecretValue) return;
    
    try {
      await navigator.clipboard.writeText(viewedSecretValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-500" />
          Secrets Wallet
        </CardTitle>
        <CardDescription>
          Securely store and manage API keys, personal access tokens, and other secrets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700 p-1">
            <TabsTrigger value="view" className="data-[state=active]:bg-slate-600">
              View Secrets
            </TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-slate-600">
              Add New Secret
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4 mt-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-pulse text-muted-foreground">Loading secrets...</div>
              </div>
            ) : secrets.length === 0 ? (
              <div className="text-center py-6 border rounded-md border-dashed border-slate-700">
                <Key className="h-10 w-10 text-slate-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No secrets found</p>
                <p className="text-xs text-slate-500 mt-1">Add a new secret to store your API keys securely</p>
              </div>
            ) : (
              <div className="space-y-2">
                {secrets.map(key => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-md border border-slate-600">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-indigo-400" />
                      <span className="font-medium">{key}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewSecret(key)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteSecret(key)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4 mt-4">
            <form onSubmit={handleAddSecret} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret-name">Secret Name</Label>
                <Input
                  id="secret-name"
                  value={secretName}
                  onChange={(e) => setSecretName(e.target.value)}
                  placeholder="e.g., OPENAI_API_KEY"
                  className="bg-slate-700 border-slate-600"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use a descriptive name for your secret that identifies its purpose
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secret-value">Secret Value</Label>
                <div className="relative">
                  <Input
                    id="secret-value"
                    type={showValue ? "text" : "password"}
                    value={secretValue}
                    onChange={(e) => setSecretValue(e.target.value)}
                    placeholder="Enter the secret value"
                    className="bg-slate-700 border-slate-600 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowValue(!showValue)}
                  >
                    {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="bg-amber-900/20 border border-amber-800/30 rounded-md p-3">
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-300">
                    <p className="font-medium">Security Notice</p>
                    <p className="text-amber-300/80 mt-1">
                      Secrets are stored securely in your Supabase database. However, you should
                      still follow best practices and avoid storing highly sensitive keys when possible.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Secret
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <Dialog open={!!selectedSecret} onOpenChange={(open) => {
        if (!open) {
          setSelectedSecret(null);
          setViewedSecretValue(null);
          setCopied(false);
        }
      }}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>Secret: {selectedSecret}</DialogTitle>
            <DialogDescription>
              This secret value is only shown once when you view it
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="viewed-secret">Secret Value</Label>
            <div className="relative">
              <Input
                id="viewed-secret"
                type={showValue ? "text" : "password"}
                value={viewedSecretValue || ""}
                readOnly
                className="pr-20 bg-slate-700 border-slate-600"
              />
              <div className="absolute right-0 top-0 h-full flex">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-full px-3"
                  onClick={() => setShowValue(!showValue)}
                >
                  {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-full px-3"
                  onClick={handleCopySecret}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => {
                setSelectedSecret(null);
                setViewedSecretValue(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
