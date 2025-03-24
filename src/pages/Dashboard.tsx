
import React, { useState, useCallback, useEffect } from "react";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { EmbeddingVisualizer } from "@/components/EmbeddingVisualizer";
import { MessageTable } from "@/components/MessageTable";
import { ThreadedMessageView } from "@/components/ThreadedMessageView";
import { UploadProgress } from "@/components/UploadProgress";
import { Chat } from "@/components/Chat";
import { LLMModelsConfig } from "@/components/LLMModelsConfig";
import { ProjectManager } from "@/components/ProjectManager";
import { SystemStatus } from "@/components/SystemStatus";
import { SecretsManager } from "@/components/SecretsManager";
import { DatabaseSetup } from "@/components/DatabaseSetup";
import { UploadedFile, UploadStats, Message } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { processChatHistory } from "@/lib/fileProcessor";
import { storageService } from "@/lib/storageService";
import { supabaseStorageService } from "@/lib/supabaseStorageService";
import { vectorDb } from "@/lib/vectorDb";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Download, 
  Save, 
  FileUp, 
  MessageSquare, 
  BarChart2, 
  Activity,
  ListTree,
  Settings,
  Database,
  MessageCircle,
  Key,
  ShieldCheck
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
  const [activeTab, setActiveTab] = useState("database");
  const [dbSetupComplete, setDbSetupComplete] = useState(false);

  // Check if we're connected to Supabase
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('_metadata').select('*').limit(1);
        
        if (error) throw error;
        
        // If we can query Supabase, we're connected
        console.log("Connected to Supabase:", data);
        
        // If DB setup is complete, load data from Supabase
        if (dbSetupComplete) {
          loadFromSupabase();
        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
        toast({
          title: "Supabase connection error",
          description: "Could not connect to Supabase. Please check your configuration.",
          variant: "destructive"
        });
      }
    };
    
    checkSupabaseConnection();
  }, [dbSetupComplete, toast]);

  // Load data from Supabase once setup is complete
  const loadFromSupabase = async () => {
    try {
      const supabaseMessages = await supabaseStorageService.loadMessages();
      const supabaseFiles = await supabaseStorageService.loadFiles();
      const supabaseStats = await supabaseStorageService.loadStats();
      const supabaseVisualizationData = await supabaseStorageService.loadVisualizationData();
      
      if (supabaseMessages.length > 0) {
        setMessages(supabaseMessages);
      }
      
      if (supabaseFiles.length > 0) {
        setFiles(supabaseFiles);
      }
      
      if (supabaseStats.totalFiles > 0 || supabaseStats.totalMessages > 0) {
        setStats(supabaseStats);
      }
      
      if (supabaseVisualizationData.length > 0) {
        setVisualizationData(supabaseVisualizationData);
      }
      
      toast({
        title: "Data loaded from Supabase",
        description: `Loaded ${supabaseMessages.length} messages and ${supabaseFiles.length} files`
      });
    } catch (error) {
      console.error("Error loading from Supabase:", error);
      toast({
        title: "Error loading data",
        description: "Could not load data from Supabase",
        variant: "destructive"
      });
    }
  };

  // Handle DB setup completion
  const handleDbSetupComplete = () => {
    setDbSetupComplete(true);
    setActiveTab("overview");
  };

  // Original functionality kept for file uploading and processing
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

        setFiles(prev => 
          prev.map(f => f.id === fileEntry.id ? { 
            ...f, 
            status: 'completed',
            progress: 100,
            messagesCount: messages.length
          } : f)
        );

        setMessages(prev => [...prev, ...messages]);

        setStats(prev => ({
          ...prev,
          processedFiles: prev.processedFiles + 1,
          totalMessages: prev.totalMessages + messages.length,
          processedMessages: prev.processedMessages + messages.length
        }));

        setVisualizationData(prev => [...prev, ...visualizationPoints]);

        // Save to Supabase if DB setup is complete
        if (dbSetupComplete) {
          await supabaseStorageService.saveMessages(messages);
          await supabaseStorageService.saveFiles([{...fileEntry, status: 'completed', progress: 100, messagesCount: messages.length}]);
          await supabaseStorageService.saveStats({
            ...stats,
            processedFiles: stats.processedFiles + 1,
            totalMessages: stats.totalMessages + messages.length,
            processedMessages: stats.processedMessages + messages.length
          });
          await supabaseStorageService.saveVisualizationData(visualizationPoints);
        }

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
  }, [toast, stats, dbSetupComplete]);

  const handleClearCompleted = useCallback(() => {
    setFiles(prev => prev.filter(file => file.status !== 'completed'));
  }, []);

  const handleRetry = useCallback((fileId: string) => {
    setFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, status: 'pending', progress: 0, error: undefined } : f)
    );
    toast({
      title: "Retry not implemented",
      description: "This is just a demo of the retry functionality",
    });
  }, [toast]);

  const handleClearAllData = useCallback(async () => {
    try {
      if (dbSetupComplete) {
        await supabaseStorageService.clearAll();
      } else {
        storageService.clearAll();
      }
      
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
    } catch (error) {
      console.error("Error clearing data:", error);
      toast({
        title: "Error clearing data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  }, [toast, dbSetupComplete]);

  const handleImportData = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const result = event.target?.result as string;
          const importedData = JSON.parse(result);
          
          // Convert string dates back to Date objects for files
          if (importedData.files && Array.isArray(importedData.files)) {
            const files = importedData.files.map((file: any) => ({
              ...file,
              timestamp: new Date(file.timestamp)
            }));
            setFiles(files);
            
            if (dbSetupComplete) {
              await supabaseStorageService.saveFiles(files);
            }
          }
          
          // Convert string dates back to Date objects for messages
          if (importedData.messages && Array.isArray(importedData.messages)) {
            const messages = importedData.messages.map((message: any) => ({
              ...message,
              timestamp: new Date(message.timestamp),
              metadata: message.metadata ? {
                ...message.metadata,
                lastModified: message.metadata.lastModified ? 
                  new Date(message.metadata.lastModified) : undefined
              } : undefined
            }));
            setMessages(messages);
            
            if (dbSetupComplete) {
              await supabaseStorageService.saveMessages(messages);
            }
          }
          
          // Set visualization data
          if (importedData.visualizationData && Array.isArray(importedData.visualizationData)) {
            setVisualizationData(importedData.visualizationData);
            
            if (dbSetupComplete) {
              await supabaseStorageService.saveVisualizationData(importedData.visualizationData);
            }
          }
          
          // Set stats
          if (importedData.stats && typeof importedData.stats === 'object') {
            setStats(importedData.stats);
            
            if (dbSetupComplete) {
              await supabaseStorageService.saveStats(importedData.stats);
            }
          }
          
          toast({
            title: "Data imported successfully",
            description: `Imported ${importedData.files?.length || 0} files and ${importedData.messages?.length || 0} messages`,
          });
        } catch (error) {
          console.error("Error importing data:", error);
          toast({
            title: "Error importing data",
            description: error instanceof Error ? error.message : "Invalid file format",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, [toast, dbSetupComplete]);

  const handleExportData = useCallback(async () => {
    try {
      let dataToExport;
      
      if (dbSetupComplete) {
        // Get fresh data from Supabase
        const supabaseMessages = await supabaseStorageService.loadMessages();
        const supabaseFiles = await supabaseStorageService.loadFiles();
        const supabaseStats = await supabaseStorageService.loadStats();
        const supabaseVisualizationData = await supabaseStorageService.loadVisualizationData();
        
        dataToExport = {
          files: supabaseFiles,
          messages: supabaseMessages,
          visualizationData: supabaseVisualizationData,
          stats: supabaseStats
        };
      } else {
        dataToExport = {
          files,
          messages,
          visualizationData,
          stats
        };
      }
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `aidatagem-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
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
  }, [files, messages, visualizationData, stats, toast, dbSetupComplete]);

  return (
    <div className="container mx-auto p-4 space-y-6 bg-[#1e2130] min-h-screen text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AIDatagem Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportData}
            title="Import data"
            disabled={!dbSetupComplete}
          >
            <Save className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            title="Export all data"
            disabled={!dbSetupComplete}
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
                disabled={!dbSetupComplete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
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
      
      {dbSetupComplete && (
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
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-9 bg-slate-800 p-1">
          {!dbSetupComplete ? (
            <TabsTrigger value="database" className="data-[state=active]:bg-slate-700">
              <Database className="h-4 w-4 mr-2" />
              Database
            </TabsTrigger>
          ) : (
            <>
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-slate-700">
                <FileUp className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-slate-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="threads" className="data-[state=active]:bg-slate-700">
                <ListTree className="h-4 w-4 mr-2" />
                Threads
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-slate-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="visualization" className="data-[state=active]:bg-slate-700">
                <BarChart2 className="h-4 w-4 mr-2" />
                Visualization
              </TabsTrigger>
              <TabsTrigger value="models" className="data-[state=active]:bg-slate-700">
                <Settings className="h-4 w-4 mr-2" />
                Models
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-slate-700">
                <Database className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="secrets" className="data-[state=active]:bg-slate-700">
                <Key className="h-4 w-4 mr-2" />
                Secrets
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        {!dbSetupComplete ? (
          <TabsContent value="database" className="mt-6">
            <DatabaseSetup onComplete={handleDbSetupComplete} />
          </TabsContent>
        ) : (
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
                  <FileUploader onFilesAdded={handleFilesAdded} />
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
        )}
      </Tabs>
      
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
    </div>
  );
};

export default Dashboard;
