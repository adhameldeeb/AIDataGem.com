
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseStatus } from "@/lib/types";
import { Database, Server, HardDrive } from "lucide-react";

export function SystemStatus() {
  const [status, setStatus] = useState<DatabaseStatus>({
    connected: true,
    totalDocuments: 0,
    totalConversations: 0,
    vectorStore: {
      embeddings: 0,
      storageSize: 0
    }
  });

  // Update status based on local storage data
  useEffect(() => {
    // In a real app, this would make API calls to check the actual database status
    // For demo purposes, we'll simulate this with local storage data
    const messagesStr = localStorage.getItem('vector-knowledge-messages');
    const messages = messagesStr ? JSON.parse(messagesStr) : [];
    
    // Count unique conversation IDs
    const conversationIds = new Set();
    messages.forEach((msg: any) => {
      if (msg.metadata?.conversationId) {
        conversationIds.add(msg.metadata.conversationId);
      }
    });
    
    // Estimate storage size (rough approximation)
    const storageSize = (
      (messagesStr?.length || 0) / 1024 / 1024
    ).toFixed(2);
    
    setStatus({
      connected: true,
      totalDocuments: messages.length,
      totalConversations: conversationIds.size,
      vectorStore: {
        embeddings: messages.length,
        storageSize: parseFloat(storageSize)
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Connected</span>
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Documents</span>
              <span className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-0.5 rounded-md">
                {status.totalDocuments}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Conversations</span>
              <span className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-0.5 rounded-md">
                {status.totalConversations}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Vector Store Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Embeddings</span>
              <span className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-0.5 rounded-md">
                {status.vectorStore.embeddings}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Storage Size</span>
              <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-0.5 rounded-md">
                {status.vectorStore.storageSize} MB
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
