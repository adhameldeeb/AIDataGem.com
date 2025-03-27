
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Heart, ExternalLink, BookOpen } from "lucide-react";
import { vectorDb } from "@/lib/vectorDb";
import { Button } from "@/components/ui/button";

interface DashboardFooterProps {
  dbSetupComplete: boolean;
}

export function DashboardFooter({ dbSetupComplete }: DashboardFooterProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-border shadow-soft">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
        <div>
          <p className="text-md font-medium text-foreground">AIDatagem - Transforming Data into Gems of Insight</p>
          <p className="flex items-center justify-center md:justify-start gap-1 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            {dbSetupComplete ? 
              "Connected to Supabase Database" : 
              "Database setup required"
            }
            {dbSetupComplete && ` • Embedding model: ${vectorDb.getCurrentModelName()}`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/documentation">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => window.open('https://github.com/your-repo/aidatagem', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            GitHub
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
          >
            <Heart className="h-4 w-4 mr-2 text-red-400" />
            Support
          </Button>
        </div>
      </div>
    </div>
  );
}
