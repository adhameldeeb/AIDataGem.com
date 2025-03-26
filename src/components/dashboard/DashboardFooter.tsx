
import React from "react";
import { ShieldCheck, Heart, ExternalLink } from "lucide-react";
import { vectorDb } from "@/lib/vectorDb";
import { Button } from "@/components/ui/button";

interface DashboardFooterProps {
  dbSetupComplete: boolean;
}

export function DashboardFooter({ dbSetupComplete }: DashboardFooterProps) {
  return (
    <div className="bg-[#1a1d2a]/70 p-4 rounded-xl backdrop-blur-sm border border-slate-700/50 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
        <div>
          <p className="text-md font-medium text-slate-300">AIDatagem - Transforming Data into Gems of Insight</p>
          <p className="flex items-center justify-center md:justify-start gap-1 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            {dbSetupComplete ? 
              "Connected to Supabase Database" : 
              "Database setup required"
            }
            {dbSetupComplete && ` • Embedding model: ${vectorDb.getCurrentModelName()}`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-slate-200"
            onClick={() => window.open('https://github.com/your-repo/aidatagem', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Documentation
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-slate-200"
          >
            <Heart className="h-4 w-4 mr-2 text-red-400" />
            Support
          </Button>
        </div>
      </div>
    </div>
  );
}
