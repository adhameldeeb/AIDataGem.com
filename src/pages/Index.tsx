
import React from "react";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/lib/hooks";
import { Link } from "react-router-dom";
import { BarChart, Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto bg-card shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            AI Orchestration Platform
          </h1>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start space-x-2">
            <Layers className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Multi-Level Orchestration</h3>
              <p className="text-sm text-muted-foreground">Hierarchical decision-making across AI platforms</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-500 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <div>
              <h3 className="font-medium">Unified Embedding Space</h3>
              <p className="text-sm text-muted-foreground">1024-dimensional vector space across platforms</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Zap className="h-5 w-5 text-cyan-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Cross-Platform Synthesis</h3>
              <p className="text-sm text-muted-foreground">Intelligent information fusion from multiple sources</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative flex flex-col flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
