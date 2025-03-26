
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity, FileUp, MessageSquare, BarChart2, Database } from "lucide-react";
import { SystemStatus } from "@/components/SystemStatus";
import { FileUploader } from "@/components/FileUploader";
import { UploadProgress } from "@/components/UploadProgress";
import { FileList } from "@/components/FileList";
import { MessageTable } from "@/components/MessageTable";
import { ThreadedMessageView } from "@/components/ThreadedMessageView";
import { Chat } from "@/components/Chat";
import { EmbeddingVisualizer } from "@/components/EmbeddingVisualizer";
import { LLMModelsConfig } from "@/components/LLMModelsConfig";
import { ProjectManager } from "@/components/ProjectManager";
import { SecretsManager } from "@/components/SecretsManager";
import { DatabaseSetup } from "@/components/DatabaseSetup";
import { UploadedFile, UploadStats, Message } from "@/lib/types";

interface DashboardContentProps {
  dbSetupComplete: boolean;
  activeTab: string;
  files: UploadedFile[];
  messages: Message[];
  stats: UploadStats;
  visualizationData: any[];
  handleDbSetupComplete: () => void;
  onFilesAdded: (files: File[], isFolder: boolean) => Promise<void>;
  handleClearCompleted: () => void;
  handleRetry: (fileId: string) => void;
}

export function DashboardContent({
  dbSetupComplete,
  activeTab,
  files,
  messages,
  stats,
  visualizationData,
  handleDbSetupComplete,
  onFilesAdded,
  handleClearCompleted,
  handleRetry
}: DashboardContentProps) {
  if (!dbSetupComplete) {
    return (
      <TabsContent value="database" className="mt-6 space-y-6 animate-fade-in">
        <Card className="bg-white border-border overflow-hidden shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
              <Database className="h-6 w-6 text-primary" />
              Database Setup
            </CardTitle>
            <CardDescription>
              Initialize your Supabase database to start storing and analyzing data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatabaseSetup onComplete={handleDbSetupComplete} />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <>
      <TabsContent value="overview" className="mt-6 space-y-6 animate-fade-in">
        <Card className="bg-white border-border overflow-hidden shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
              <Activity className="h-6 w-6 text-primary" />
              System Overview
            </CardTitle>
            <CardDescription>
              Overview of AIDatagem system status and key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SystemStatus />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="upload" className="space-y-6 mt-6 animate-fade-in">
        <Card className="bg-white border-border overflow-hidden shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
              <FileUp className="h-6 w-6 text-primary" />
              Upload Content
            </CardTitle>
            <CardDescription>
              Upload JSON files containing chat history to analyze and visualize embeddings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onFilesAdded={onFilesAdded} />
          </CardContent>
        </Card>
        
        <UploadProgress stats={stats} />
        
        <Card className="bg-white border-border overflow-hidden shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileUp className="h-5 w-5 text-primary" />
              Uploaded Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileList 
              files={files} 
              onClearCompleted={handleClearCompleted} 
              onRetry={handleRetry}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="messages" className="mt-6 animate-fade-in">
        <Card className="bg-white border-border overflow-hidden shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
              <MessageSquare className="h-6 w-6 text-primary" />
              Message Data
            </CardTitle>
            <CardDescription>
              Search, filter, and analyze message content from your chat history
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <MessageTable messages={messages} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="threads" className="mt-6 animate-fade-in">
        <Card className="bg-white border-border overflow-hidden shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
              <MessageSquare className="h-6 w-6 text-primary" />
              Threaded Message View
            </CardTitle>
            <CardDescription>
              View messages in a threaded format with conversations and topics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <ThreadedMessageView messages={messages} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="chat" className="mt-6 animate-fade-in">
        <Card className="bg-white border-border overflow-hidden shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
              <MessageSquare className="h-6 w-6 text-primary" />
              AIDatagem Chat
            </CardTitle>
            <CardDescription>
              Interact with your data using natural language queries
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px]">
              <Chat />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="visualization" className="mt-6 animate-fade-in">
        <Card className="bg-white border-border overflow-hidden shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
              <BarChart2 className="h-6 w-6 text-primary" />
              Embedding Visualization
            </CardTitle>
            <CardDescription>
              Visual representation of message embeddings in 2D space
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[600px]">
            <EmbeddingVisualizer data={visualizationData} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="models" className="mt-6 animate-fade-in">
        <LLMModelsConfig />
      </TabsContent>
      
      <TabsContent value="projects" className="mt-6 animate-fade-in">
        <ProjectManager messages={messages} />
      </TabsContent>
      
      <TabsContent value="secrets" className="mt-6 animate-fade-in">
        <SecretsManager />
      </TabsContent>
    </>
  );
}
