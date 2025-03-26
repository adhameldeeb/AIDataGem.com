
import React, { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmbeddingModelInfo } from "@/components/dashboard/EmbeddingModelInfo";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { useDataManager } from "@/components/dashboard/useDataManager";
import { isSupabaseAvailable } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("database");
  const [dbSetupComplete, setDbSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check Supabase connection on component mount
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      setIsLoading(true);
      const isAvailable = await isSupabaseAvailable();
      setDbSetupComplete(isAvailable);
      setIsLoading(false);
      
      if (isAvailable) {
        setActiveTab("overview");
        toast({
          title: "Supabase Connected",
          description: "Successfully connected to Supabase database",
        });
      }
    };
    
    checkSupabaseConnection();
  }, [toast]);

  // Handle DB setup completion
  const handleDbSetupComplete = () => {
    setDbSetupComplete(true);
    setActiveTab("overview");
    toast({
      title: "Database Setup Complete",
      description: "Successfully set up Supabase database schema",
    });
  };

  // Use custom hook to manage data and operations
  const {
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
  } = useDataManager(dbSetupComplete);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-6">
        <DashboardHeader 
          dbSetupComplete={dbSetupComplete}
          handleImportData={handleImportData}
          handleExportData={handleExportData}
          handleClearAllData={handleClearAllData}
        />
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary opacity-75 mb-4"></div>
              <p className="text-lg text-primary">Connecting to Supabase...</p>
            </div>
          </div>
        ) : (
          <>
            <EmbeddingModelInfo 
              dbSetupComplete={dbSetupComplete} 
              setActiveTab={setActiveTab} 
            />
            
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-border shadow-soft">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <DashboardTabs 
                  dbSetupComplete={dbSetupComplete} 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                />
                
                <DashboardContent 
                  dbSetupComplete={dbSetupComplete}
                  activeTab={activeTab}
                  files={files}
                  messages={messages}
                  stats={stats}
                  visualizationData={visualizationData}
                  handleDbSetupComplete={handleDbSetupComplete}
                  onFilesAdded={handleFilesAdded}
                  handleClearCompleted={handleClearCompleted}
                  handleRetry={handleRetry}
                />
              </Tabs>
            </div>
            
            <DashboardFooter 
              dbSetupComplete={dbSetupComplete} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
