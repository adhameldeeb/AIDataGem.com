
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
      <TabsContent value="database" className="mt-6">
        <DatabaseSetup onComplete={handleDbSetupComplete} />
      </TabsContent>
    );
  }

  return (
    <>
      <TabsContent value="overview" className="mt-6">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
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
      
      <TabsContent value="upload" className="space-y-4 mt-6">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle>Upload Content</CardTitle>
            <CardDescription>
              Upload JSON files containing chat history to analyze and visualize embeddings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onFilesAdded={onFilesAdded} />
          </CardContent>
        </Card>
        
        <UploadProgress stats={stats} />
        
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
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
      
      <TabsContent value="messages" className="mt-6">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle>Message Data</CardTitle>
            <CardDescription>
              Search, filter, and analyze message content from your chat history.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <MessageTable messages={messages} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="threads" className="mt-6">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle>Threaded Message View</CardTitle>
            <CardDescription>
              View messages in a threaded format with conversations and topics.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <ThreadedMessageView messages={messages} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="chat" className="mt-6">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle>AIDatagem Chat</CardTitle>
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
      
      <TabsContent value="visualization" className="mt-6">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle>Embedding Visualization</CardTitle>
            <CardDescription>
              Visual representation of message embeddings in 2D space.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[600px]">
            <EmbeddingVisualizer data={visualizationData} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="models" className="mt-6">
        <LLMModelsConfig />
      </TabsContent>
      
      <TabsContent value="projects" className="mt-6">
        <ProjectManager messages={messages} />
      </TabsContent>
      
      <TabsContent value="secrets" className="mt-6">
        <SecretsManager />
      </TabsContent>
    </>
  );
}
