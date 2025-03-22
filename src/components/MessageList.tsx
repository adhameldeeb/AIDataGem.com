
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
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-semibold mb-2">
              Personal Knowledge Assistant
            </h1>
            <p className="mb-4 text-muted-foreground">
              Ask a question to get started
            </p>
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
