
import React from "react";
import { Message } from "@/lib/types";
import { ChatMessage, LoadingMessage } from "./ChatMessage";
import { useAutoScroll } from "@/lib/hooks";
import { Layers, Zap, Globe, Network, Server } from "lucide-react";

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
              Next-Generation AI Orchestration
            </h1>
            
            <p className="mb-6 text-muted-foreground leading-relaxed">
              Our platform implements a sophisticated coarse-to-fine reinforcement learning framework 
              for intelligent orchestration across multiple AI platforms with unified embedding space.
            </p>
            
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
                  HNSW indexing with 99.5% accuracy and partitioning based on temporal dimensions.
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
