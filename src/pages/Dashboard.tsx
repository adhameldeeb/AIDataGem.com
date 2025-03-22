
import React, { useState, useCallback, useEffect } from "react";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { EmbeddingVisualizer } from "@/components/EmbeddingVisualizer";
import { MessageTable } from "@/components/MessageTable";
import { UploadProgress } from "@/components/UploadProgress";
import { UploadedFile, UploadStats, Message } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { processChatHistory } from "@/lib/fileProcessor";
import { storageService } from "@/lib/storageService";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Download, 
  Save, 
  Database, 
  FileUp, 
  MessageSquare, 
  BarChart2, 
  Activity 
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<UploadStats>({
    totalFiles: 0,
    processedFiles: 0,
    totalMessages: 0,
    processedMessages: 0,
  });
  const [visualizationData, setVisualizationData] = useState<any[]>([]);
  const { toast } = useToast();

  // Load data from storage on component mount
  useEffect(() => {
    const loadFromStorage = () => {
      const savedFiles = storageService.loadFiles();
      const savedMessages = storageService.loadMessages();
      const savedStats = storageService.loadStats();
      const savedVisualizationData = storageService.loadVisualizationData();

      if (savedFiles.length > 0) {
        setFiles(savedFiles);
      }
      
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      }
      
      if (savedStats.totalFiles > 0 || savedStats.totalMessages > 0) {
        setStats(savedStats);
      }
      
      if (savedVisualizationData.length > 0) {
        setVisualizationData(savedVisualizationData);
      }
    };

    loadFromStorage();
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    // Only save if there's data to save
    if (files.length > 0) {
      storageService.saveFiles(files);
    }
    
    if (messages.length > 0) {
      storageService.saveMessages(messages);
    }
    
    if (stats.totalFiles > 0 || stats.totalMessages > 0) {
      storageService.saveStats(stats);
    }
    
    if (visualizationData.length > 0) {
      storageService.saveVisualizationData(visualizationData);
    }
  }, [files, messages, stats, visualizationData]);

  const handleFilesAdded = useCallback(async (newFiles: File[], isFolder: boolean) => {
    const fileEntries = newFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending' as const,
      progress: 0,
      timestamp: new Date()
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

        // Update messages state
        setMessages(prev => [...prev, ...messages]);

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

  const handleClearAllData = useCallback(() => {
    storageService.clearAll();
    setFiles([]);
    setMessages([]);
    setVisualizationData([]);
    setStats({
      totalFiles: 0,
      processedFiles: 0,
      totalMessages: 0,
      processedMessages: 0,
    });
    
    toast({
      title: "All data cleared",
      description: "All files, messages, and visualization data have been cleared",
    });
  }, [toast]);

  const handleExportData = useCallback(() => {
    try {
      const exportData = {
        files,
        messages,
        visualizationData,
        stats
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `vector-knowledge-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Data exported successfully",
        description: "All data has been exported to a JSON file",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Error exporting data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  }, [files, messages, visualizationData, stats, toast]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vector Knowledge Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            title="Export all data"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                title="Clear all data"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear All Data</DialogTitle>
                <DialogDescription>
                  This will permanently delete all files, messages, and visualization data.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleClearAllData}
                >
                  Yes, Clear All Data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">
            <FileUp className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="visualization">
            <BarChart2 className="h-4 w-4 mr-2" />
            Visualization
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Activity className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
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
        
        <TabsContent value="messages">
          <Card>
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
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Estimated Storage Usage</h3>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Local Storage</span>
                    <span className="text-sm font-medium">
                      {Math.round((JSON.stringify(messages).length + 
                                  JSON.stringify(files).length + 
                                  JSON.stringify(visualizationData).length) / 1024)} KB
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Browser local storage is limited to ~5MB. For larger datasets, consider using a database solution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
