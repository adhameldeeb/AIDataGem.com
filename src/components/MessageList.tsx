
import React from "react";
import { Message } from "@/lib/types";
import { ChatMessage, LoadingMessage } from "./ChatMessage";
import { useAutoScroll } from "@/lib/hooks";
import { Layers, Zap, Globe, Network, Server, Map, Clock, Rabbit } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const { ref } = useAutoScroll([messages, isLoading]);
  
  return (
    <div 
      ref={ref}
      className="flex-1 overflow-y-auto overflow-x-hidden py-4"
    >
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="mx-auto flex max-w-[640px] flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              Deep Knowledge Exploration
            </h1>
            
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="mb-6 text-muted-foreground leading-relaxed">
                <em>In the not-so-distant past, researchers would spend weeks navigating information silos, following 
                fragmented trails of knowledge through dusty archives and disconnected databases. The deeper they went, 
                the slower their progress. But what if the journey could happen at the speed of thought?</em>
              </p>
              
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Our platform implements sophisticated retrieval algorithms with millisecond response times, 
                enabling you to dive into deep knowledge rabbit holes and emerge with comprehensive insights
                within minutes instead of days.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left w-full">
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center mb-2 text-purple-500">
                  <Layers className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Hierarchical Decision Making</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Multi-level orchestration for optimal platform routing, query refinement, and precision tuning.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center mb-2 text-blue-500">
                  <Network className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Value-Based Learning System</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Q-Network design with distributional critic and prioritized experience replay.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center mb-2 text-cyan-500">
                  <Server className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Unified Vector Database</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  HNSW indexing with 99.5% accuracy and enriched metadata including sentiment, cultural context, and domain expertise.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center mb-2 text-green-500">
                  <Globe className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Cross-Platform Retrieval</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Universal query interface with multi-stage pipeline and weighted relevance scoring.
                </p>
              </div>
            </div>

            <div className="mt-8 w-full">
              <div className="border rounded-lg p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 text-left w-full">
                <div className="flex items-center mb-3 text-amber-600 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2">
                    <path d="M19 9c0 0-1 -5.125 -1 -6c0 -1 -1 -1 -1 -1h-8s-1 0 -1 1c0 .99 -1 6 -1 6"></path>
                    <path d="M11 12v4"></path>
                    <path d="M18 12c-.948 0 -1.61 1.714 -2 4c-.384 2.24 .132 1.992 3 2"></path>
                    <path d="M6 12c.948 0 1.61 1.714 2 4c.384 2.24 -.132 1.992 -3 2"></path>
                    <path d="M17 6h-10l-2 6h14l-2 -6z"></path>
                  </svg>
                  <h3 className="font-bold text-lg">Follow the Knowledge Rabbit Hole</h3>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                  Ask a simple question, and watch as our system tunnels through interconnected information 
                  landscapes, surfacing rich insights with contextual awareness in minutes rather than hours.
                </p>
                <div className="flex items-center text-amber-700 dark:text-amber-400 text-xs">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Average deep exploration time: <strong>3-5 minutes</strong> vs. traditional research taking days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <LoadingMessage />}
        </>
      )}
    </div>
  );
}
