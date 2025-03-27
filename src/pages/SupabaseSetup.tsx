
import React, { useState, useEffect } from "react";
import { SupabaseConnector } from "@/components/SupabaseConnector";
import { DatabaseSetup } from "@/components/DatabaseSetup";
import { Container } from "@/components/ui/container";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function SupabaseSetup() {
  const [step, setStep] = useState<"connect" | "setup">("connect");
  const [refreshKey, setRefreshKey] = useState(0); // Used to force component remount
  const navigate = useNavigate();

  // Check if we already have credentials saved
  useEffect(() => {
    const savedUrl = localStorage.getItem("SUPABASE_URL");
    const savedKey = localStorage.getItem("SUPABASE_ANON_KEY");
    
    if (savedUrl && savedKey) {
      // Skip connection step if we already have credentials
      setStep("setup");
    }
  }, [refreshKey]);

  const handleConnect = () => {
    setStep("setup");
  };

  const handleSetupComplete = () => {
    navigate("/dashboard");
  };

  const handleResetConnection = () => {
    // Clear stored credentials and go back to connection step
    localStorage.removeItem("SUPABASE_URL");
    localStorage.removeItem("SUPABASE_ANON_KEY");
    setStep("connect");
    // Force reload of component to pick up new credentials
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container className="max-w-4xl py-12">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Badge variant="outline" className="ml-2">Setup</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Supabase Integration</h1>
        <p className="text-slate-400 max-w-3xl">
          Connect your application to Supabase to enable database functionality, file storage, 
          and backend processing capabilities.
        </p>
        
        {step === "setup" && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetConnection}
              className="flex items-center gap-1 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Connection
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-10">
        {step === "connect" ? (
          <>
            <Alert className="bg-amber-900/20 border-amber-800/30 mb-6">
              <AlertTitle className="text-amber-500">Setup Instructions</AlertTitle>
              <AlertDescription className="text-amber-300/90">
                <p className="mb-2">To connect your app to Supabase:</p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Enter your Supabase project URL and anon key below</li>
                  <li>We'll create all required database tables and structures automatically</li>
                  <li>Your local data will be migrated to Supabase</li>
                </ol>
              </AlertDescription>
            </Alert>
            <SupabaseConnector onConnect={handleConnect} key={`connector-${refreshKey}`} />
          </>
        ) : (
          <DatabaseSetup onComplete={handleSetupComplete} key={`setup-${refreshKey}`} />
        )}
      </div>
    </Container>
  );
}
