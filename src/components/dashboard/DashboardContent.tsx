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
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 z-0"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Database className="h-6 w-6 text-blue-400" />
              Database Setup
            </CardTitle>
            <CardDescription className="text-slate-400">
              Initialize your Supabase database to start storing and analyzing data
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <DatabaseSetup onComplete={handleDbSetupComplete} />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <>
      <TabsContent value="overview" className="mt-6 space-y-6 animate-fade-in">
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 z-0"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Activity className="h-6 w-6 text-blue-400" />
              System Overview
            </CardTitle>
            <CardDescription className="text-slate-400">
              Overview of AIDatagem system status and key metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <SystemStatus />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="upload" className="space-y-6 mt-6 animate-fade-in">
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 z-0"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileUp className="h-6 w-6 text-blue-400" />
              Upload Content
            </CardTitle>
            <CardDescription className="text-slate-400">
              Upload JSON files containing chat history to analyze and visualize embeddings
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <FileUploader onFilesAdded={onFilesAdded} />
          </CardContent>
        </Card>
        
        <UploadProgress stats={stats} />
        
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/5 z-0"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-blue-400" />
              Uploaded Files
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <FileList 
              files={files} 
              onClearCompleted={handleClearCompleted} 
              onRetry={handleRetry}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="messages" className="mt-6 animate-fade-in">
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 z-0"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              Message Data
            </CardTitle>
            <CardDescription className="text-slate-400">
              Search, filter, and analyze message content from your chat history
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 relative z-10">
            <MessageTable messages={messages} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="threads" className="mt-6 animate-fade-in">
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 z-0"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              Threaded Message View
            </CardTitle>
            <CardDescription className="text-slate-400">
              View messages in a threaded format with conversations and topics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 relative z-10">
            <ThreadedMessageView messages={messages} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="chat" className="mt-6 animate-fade-in">
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 z-0"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              AIDatagem Chat
            </CardTitle>
            <CardDescription className="text-slate-400">
              Interact with your data using natural language queries
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 relative z-10">
            <div className="h-[600px]">
              <Chat />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="visualization" className="mt-6 animate-fade-in">
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 z-0"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BarChart2 className="h-6 w-6 text-blue-400" />
              Embedding Visualization
            </CardTitle>
            <CardDescription className="text-slate-400">
              Visual representation of message embeddings in 2D space
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[600px] relative z-10">
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
