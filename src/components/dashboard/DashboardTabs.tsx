
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
    <TabsList className="grid w-full grid-cols-1 md:grid-cols-9 gap-2 bg-secondary/30 p-1 rounded-lg border border-border">
      {!dbSetupComplete ? (
        <TabsTrigger 
          value="database" 
          className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
        >
          <Database className="h-4 w-4 mr-2" />
          Database Setup
        </TabsTrigger>
      ) : (
        <>
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger 
            value="threads" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <ListTree className="h-4 w-4 mr-2" />
            Threads
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="visualization" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Visualize
          </TabsTrigger>
          <TabsTrigger 
            value="models" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <Flame className="h-4 w-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <Database className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="secrets" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:shadow-sm bg-transparent border border-transparent hover:bg-background/60 text-foreground"
          >
            <Key className="h-4 w-4 mr-2" />
            Secrets
          </TabsTrigger>
        </>
      )}
    </TabsList>
  );
}
