
import { useState, useCallback, useEffect } from "react";
import { UploadedFile, UploadStats, Message } from "@/lib/types";
import { supabaseStorageService } from "@/lib/supabaseStorageService";
import { storageService } from "@/lib/storageService";
import { processChatHistory } from "@/lib/fileProcessor";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function useDataManager(dbSetupComplete: boolean) {
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

  // Check if we're connected to Supabase
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Simplified connection check
        const { data, error } = await supabase.rpc('get_service_status');
        
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

  return {
    files,
    messages,
    stats,
    visualizationData,
    handleFilesAdded,
    handleClearCompleted,
    handleRetry,
    handleClearAllData,
    handleImportData,
    handleExportData
  };
}
