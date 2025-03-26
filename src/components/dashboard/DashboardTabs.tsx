
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
  Key,
  Flame
} from "lucide-react";

interface DashboardTabsProps {
  dbSetupComplete: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardTabs({ dbSetupComplete, activeTab, setActiveTab }: DashboardTabsProps) {
  return (
    <TabsList className="grid w-full grid-cols-1 md:grid-cols-9 gap-2 bg-transparent p-1">
      {!dbSetupComplete ? (
        <TabsTrigger 
          value="database" 
          className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
        >
          <Database className="h-4 w-4 mr-2" />
          Database Setup
        </TabsTrigger>
      ) : (
        <>
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger 
            value="threads" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <ListTree className="h-4 w-4 mr-2" />
            Threads
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="visualization" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Visualize
          </TabsTrigger>
          <TabsTrigger 
            value="models" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <Flame className="h-4 w-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <Database className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="secrets" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-600 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
          >
            <Key className="h-4 w-4 mr-2" />
            Secrets
          </TabsTrigger>
        </>
      )}
    </TabsList>
  );
}
