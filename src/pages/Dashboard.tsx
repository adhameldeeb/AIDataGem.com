
import React, { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmbeddingModelInfo } from "@/components/dashboard/EmbeddingModelInfo";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { useDataManager } from "@/components/dashboard/useDataManager";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("database");
  const [dbSetupComplete, setDbSetupComplete] = useState(false);

  // Handle DB setup completion
  const handleDbSetupComplete = () => {
    setDbSetupComplete(true);
    setActiveTab("overview");
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
    <div className="container mx-auto p-4 space-y-6 bg-[#1e2130] min-h-screen text-white">
      <DashboardHeader 
        dbSetupComplete={dbSetupComplete}
        handleImportData={handleImportData}
        handleExportData={handleExportData}
        handleClearAllData={handleClearAllData}
      />
      
      <EmbeddingModelInfo 
        dbSetupComplete={dbSetupComplete} 
        setActiveTab={setActiveTab} 
      />
      
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
      
      <DashboardFooter 
        dbSetupComplete={dbSetupComplete} 
      />
    </div>
  );
};

export default Dashboard;
