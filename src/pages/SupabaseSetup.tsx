
import React, { useState } from "react";
import { SupabaseConnector } from "@/components/SupabaseConnector";
import { DatabaseSetup } from "@/components/DatabaseSetup";
import { Container } from "@/components/ui/container";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function SupabaseSetup() {
  const [step, setStep] = useState<"connect" | "setup">("connect");
  const navigate = useNavigate();

  const handleConnect = () => {
    setStep("setup");
  };

  const handleSetupComplete = () => {
    navigate("/dashboard");
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
      </div>

      <div className="space-y-10">
        {step === "connect" ? (
          <SupabaseConnector onConnect={handleConnect} />
        ) : (
          <DatabaseSetup onComplete={handleSetupComplete} />
        )}
      </div>
    </Container>
  );
}
