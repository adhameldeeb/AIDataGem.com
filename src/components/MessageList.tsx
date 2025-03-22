
import React from "react";
import { Message } from "@/lib/types";
import { ChatMessage, LoadingMessage } from "./ChatMessage";
import { useAutoScroll } from "@/lib/hooks";

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
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl font-semibold mb-2">
              Vector Knowledge Assistant
            </h1>
            <p className="mb-4 text-muted-foreground">
              I can answer questions about vector databases, embedding management, 
              and knowledge retrieval systems. Try asking about:
            </p>
            <ul className="text-left list-disc pl-5 mb-4 text-muted-foreground">
              <li>Two-way vector access</li>
              <li>Cross-platform embedding strategy</li>
              <li>Vector database architecture</li>
              <li>Query processing pipeline</li>
              <li>Knowledge synthesis mechanisms</li>
            </ul>
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
