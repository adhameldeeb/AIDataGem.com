
import React, { useState, useCallback } from "react";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { EmbeddingVisualizer } from "@/components/EmbeddingVisualizer";
import { UploadProgress } from "@/components/UploadProgress";
import { UploadedFile, UploadStats } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { processChatHistory } from "@/lib/fileProcessor";

const Dashboard = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [stats, setStats] = useState<UploadStats>({
    totalFiles: 0,
    processedFiles: 0,
    totalMessages: 0,
    processedMessages: 0,
  });
  const [visualizationData, setVisualizationData] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFilesAdded = useCallback(async (newFiles: File[], isFolder: boolean) => {
    const fileEntries = newFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending' as const,
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...fileEntries]);
    setStats(prev => ({
      ...prev,
      totalFiles: prev.totalFiles + fileEntries.length
    }));

    toast({
      title: isFolder ? "Folder upload started" : "Files upload started",
      description: `Processing ${fileEntries.length} files`,
    });

    // Process each file
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const fileEntry = fileEntries[i];
      
      try {
        setFiles(prev => 
          prev.map(f => f.id === fileEntry.id ? { ...f, status: 'processing' } : f)
        );

        const { messages, visualizationPoints } = await processChatHistory(file, (progress) => {
          setFiles(prev => 
            prev.map(f => f.id === fileEntry.id ? { ...f, progress } : f)
          );
        });

        // Update file status
        setFiles(prev => 
          prev.map(f => f.id === fileEntry.id ? { 
            ...f, 
            status: 'completed',
            progress: 100,
            messagesCount: messages.length
          } : f)
        );

        // Update stats
        setStats(prev => ({
          ...prev,
          processedFiles: prev.processedFiles + 1,
          totalMessages: prev.totalMessages + messages.length,
          processedMessages: prev.processedMessages + messages.length
        }));

        // Update visualization data
        setVisualizationData(prev => [...prev, ...visualizationPoints]);

        toast({
          title: "File processed successfully",
          description: `${file.name}: ${messages.length} messages processed`,
        });
      } catch (error) {
        console.error("Error processing file:", file.name, error);
        setFiles(prev => 
          prev.map(f => f.id === fileEntry.id ? { 
            ...f, 
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error' 
          } : f)
        );

        toast({
          title: "Error processing file",
          description: `${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleClearCompleted = useCallback(() => {
    setFiles(prev => prev.filter(file => file.status !== 'completed'));
  }, []);

  const handleRetry = useCallback((fileId: string) => {
    setFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, status: 'pending', progress: 0, error: undefined } : f)
    );
    // In a real implementation, we would re-process the file here
    toast({
      title: "Retry not implemented",
      description: "This is just a demo of the retry functionality",
    });
  }, [toast]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Vector Knowledge Dashboard</h1>
      
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Chat History</CardTitle>
              <CardDescription>
                Upload JSON files containing chat history to analyze and visualize embeddings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFilesAdded={handleFilesAdded} />
            </CardContent>
          </Card>
          
          <UploadProgress stats={stats} />
          
          <Card>
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
        
        <TabsContent value="visualization">
          <Card>
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
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Processing Statistics</CardTitle>
              <CardDescription>
                Overview of chat history processing metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm text-muted-foreground">Total Files</h3>
                  <p className="text-2xl font-bold">{stats.totalFiles}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm text-muted-foreground">Processed Files</h3>
                  <p className="text-2xl font-bold">{stats.processedFiles}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm text-muted-foreground">Total Messages</h3>
                  <p className="text-2xl font-bold">{stats.totalMessages}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm text-muted-foreground">Processed Messages</h3>
                  <p className="text-2xl font-bold">{stats.processedMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
