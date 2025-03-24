
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  FileUp, 
  MessageSquare, 
  ListTree, 
  MessageCircle, 
  BarChart2, 
  Settings, 
  Database, 
  Key 
} from "lucide-react";

interface DashboardTabsProps {
  dbSetupComplete: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardTabs({ dbSetupComplete, activeTab, setActiveTab }: DashboardTabsProps) {
  return (
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
  );
}
