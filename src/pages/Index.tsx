import React from "react";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/lib/hooks";
import { Link } from "react-router-dom";
import { BarChart, Layers, Zap, Hourglass, Rabbit, ArrowRight, ClipboardCheck } from "lucide-react";
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
        
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <em>Imagine standing at the entrance of the world's most extensive library. Every book, document, and scrap of 
            knowledge is at your fingertips—not in days or hours, but in milliseconds. This isn't just search; 
            it's a journey into the depths of connected knowledge.</em>
          </p>
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
              <p className="text-sm text-muted-foreground">1024-dimensional vector space capturing nuanced semantics</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-muted/40 p-4 rounded-lg border">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-amber-500">
                <path d="M19 9c0 0-1 -5.125 -1 -6c0 -1 -1 -1 -1 -1h-8s-1 0 -1 1c0 .99 -1 6 -1 6"></path>
                <path d="M11 12v4"></path>
                <path d="M18 12c-.948 0 -1.61 1.714 -2 4c-.384 2.24 .132 1.992 3 2"></path>
                <path d="M6 12c.948 0 1.61 1.714 2 4c.384 2.24 -.132 1.992 -3 2"></path>
                <path d="M17 6h-10l-2 6h14l-2 -6z"></path>
              </svg>
              <h3 className="font-medium">Deep Rabbit Hole Investigations</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              What once took researchers days or weeks now takes <span className="font-semibold">minutes</span>. 
              Follow complex knowledge trails through interconnected information landscapes with our 
              proprietary tunneling algorithms.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Hourglass className="h-5 w-5 text-rose-500" />
              <h3 className="font-medium">Millisecond Response Rates</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Enhanced with rich metadata including sentiment analysis, cultural context, 
              and specialized domain knowledge—all delivered in the time it takes to blink.
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-4 rounded-lg border bg-amber-50/30 dark:bg-amber-900/10">
          <div className="flex items-start space-x-3 mb-3">
            <ClipboardCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-400">Independent Verification Needed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                While our internal tests show promising results, we're actively seeking independent benchmarking 
                to validate our performance claims across various knowledge domains and query complexities.
              </p>
              <div className="mt-3 flex flex-col space-y-2">
                <div className="flex items-center text-xs">
                  <span className="inline-block w-24 text-muted-foreground">Initial response:</span>
                  <span className="font-medium">~150-300ms</span>
                  <span className="text-xs text-muted-foreground ml-2">(preliminary, to be verified)</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="inline-block w-24 text-muted-foreground">Deep exploration:</span>
                  <span className="font-medium">3-5 minutes</span>
                  <span className="text-xs text-muted-foreground ml-2">(vs. hours/days with traditional methods)</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="inline-block w-24 text-muted-foreground">Accuracy:</span>
                  <span className="font-medium">Under assessment</span>
                </div>
              </div>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="text-xs h-7 bg-amber-100/50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/40">
                  Join our benchmarking program
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
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
