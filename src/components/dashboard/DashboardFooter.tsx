
import React from "react";
import { ShieldCheck } from "lucide-react";
import { vectorDb } from "@/lib/vectorDb";

interface DashboardFooterProps {
  dbSetupComplete: boolean;
}

export function DashboardFooter({ dbSetupComplete }: DashboardFooterProps) {
  return (
    <div className="text-center text-xs text-slate-400 mt-8">
      <p>AIDatagem - Transforming Data into Gems of Insight</p>
      <p className="flex items-center justify-center gap-1">
        <ShieldCheck className="h-3 w-3 text-green-400" />
        {dbSetupComplete ? 
          "Connected to Supabase Database" : 
          "Database setup required"
        }
        {dbSetupComplete && ` • Embedding model: ${vectorDb.getCurrentModelName()}`}
      </p>
    </div>
  );
}
