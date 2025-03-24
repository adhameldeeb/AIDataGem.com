
import React from "react";
import { Button } from "@/components/ui/button";
import { vectorDb } from "@/lib/vectorDb";

interface EmbeddingModelInfoProps {
  dbSetupComplete: boolean;
  setActiveTab: (tab: string) => void;
}

export function EmbeddingModelInfo({ dbSetupComplete, setActiveTab }: EmbeddingModelInfoProps) {
  if (!dbSetupComplete) return null;
  
  return (
    <div className="bg-primary/10 p-4 rounded-md">
      <h2 className="text-lg font-medium mb-2">Current Embedding Model</h2>
      <div className="flex justify-between items-center">
        <p>
          <span className="text-muted-foreground">Using:</span>{" "}
          <span className="font-medium">{vectorDb.getCurrentModelName()}</span>
        </p>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => setActiveTab("models")}
        >
          Configure Models
        </Button>
      </div>
    </div>
  );
}
