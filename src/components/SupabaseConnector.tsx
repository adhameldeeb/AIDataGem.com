
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Database } from "lucide-react";

interface SupabaseConnectorProps {
  onConnect?: () => void;
}

export function SupabaseConnector({ onConnect }: SupabaseConnectorProps) {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      toast.error("Please provide both Supabase URL and Anonymous Key");
      return;
    }

    setIsConnecting(true);
    
    try {
      // Create and update the integrations/supabase/client.ts file
      // In Lovable, we would use environment variables, but for now we'll
      // demonstrate connecting with direct values
      localStorage.setItem("SUPABASE_URL", supabaseUrl);
      localStorage.setItem("SUPABASE_ANON_KEY", supabaseAnonKey);
      
      toast.success("Supabase connection details saved", {
        description: "Refresh the page to connect to your Supabase project"
      });

      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
      toast.error("Failed to connect to Supabase", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-400" />
          Connect to Supabase
        </CardTitle>
        <CardDescription>
          Enter your Supabase project details to connect your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supabase-url">Supabase URL</Label>
          <Input
            id="supabase-url"
            placeholder="https://your-project-id.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-slate-100"
          />
          <p className="text-xs text-slate-400">
            Find this in your Supabase project settings under API section
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabase-key">Supabase Anon Key</Label>
          <Input
            id="supabase-key"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={supabaseAnonKey}
            onChange={(e) => setSupabaseAnonKey(e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-slate-100"
          />
          <p className="text-xs text-slate-400">
            This is your project's anon/public API key
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? "Connecting..." : "Connect to Supabase"}
        </Button>
      </CardFooter>
    </Card>
  );
}
