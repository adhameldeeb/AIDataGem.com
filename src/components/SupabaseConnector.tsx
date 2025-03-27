
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Database, Shield, AlertCircle } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

interface SupabaseConnectorProps {
  onConnect?: () => void;
}

export function SupabaseConnector({ onConnect }: SupabaseConnectorProps) {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Load saved credentials if they exist
  useEffect(() => {
    const savedUrl = localStorage.getItem("SUPABASE_URL");
    const savedKey = localStorage.getItem("SUPABASE_ANON_KEY");
    
    if (savedUrl) setSupabaseUrl(savedUrl);
    if (savedKey) setSupabaseAnonKey(savedKey);
  }, []);

  const testConnection = async (url: string, key: string) => {
    try {
      // Create a temporary Supabase client to test the connection
      const supabase = createClient(url, key);
      
      // Simple query to test connection - .catch() is not available on this object
      // Instead, check the error property of the returned object
      const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
      
      // If there's an error about tables not existing, that's actually okay
      // It means the credentials are valid but tables aren't set up yet
      if (error && error.message && (
        error.message.includes("does not exist") || 
        error.message.includes("relation") ||
        error.code === "42P01" // PostgreSQL code for undefined table
      )) {
        return { success: true };
      }
      
      if (error && !error.message.includes("does not exist")) {
        throw new Error(error.message || "Connection failed");
      }
      
      return { success: true };
    } catch (error) {
      console.error("Connection test error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown connection error" 
      };
    }
  };

  const handleConnect = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      toast.error("Please provide both Supabase URL and Anonymous Key");
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      // Test the connection first
      const testResult = await testConnection(supabaseUrl, supabaseAnonKey);
      
      if (!testResult.success) {
        setConnectionError(testResult.error || "Connection failed. Please check your credentials.");
        toast.error("Failed to connect to Supabase", {
          description: testResult.error || "Please verify your URL and key"
        });
        setIsConnecting(false);
        return;
      }
      
      // Save the credentials
      localStorage.setItem("SUPABASE_URL", supabaseUrl);
      localStorage.setItem("SUPABASE_ANON_KEY", supabaseAnonKey);
      
      // Update the client.ts file (in a real environment this would be done differently)
      // In Lovable, for demonstration we'll just use localStorage and reload
      
      toast.success("Supabase connection successful", {
        description: "Your credentials have been saved"
      });

      // Delay slightly to allow the toast to be seen
      setTimeout(() => {
        if (onConnect) {
          onConnect();
        }
      }, 1000);
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setConnectionError(errorMessage);
      toast.error("Failed to connect to Supabase", {
        description: errorMessage
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

        {connectionError && (
          <div className="bg-red-900/20 border border-red-800/30 rounded-md p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium text-red-400">Connection error</span>
              <p className="text-red-300/80 mt-1">{connectionError}</p>
            </div>
          </div>
        )}

        <div className="bg-slate-700/30 p-4 rounded-md border border-slate-700 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium">Important Note</span>
          </div>
          <p className="text-xs text-slate-400">
            We'll create all necessary database tables and storage once connected. 
            If this is a new Supabase project, don't worry about missing tables - 
            our setup will create everything needed.
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
