
import React, { useEffect, useRef } from "react";
import { ChatMessage, LoadingMessage } from "@/components/ChatMessage";
import { Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto py-4 bg-gradient-to-b from-background to-background/80">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-4">
            <h3 className="text-xl font-semibold">Welcome to AIDatagem</h3>
            <p className="text-muted-foreground">
              Discover the hidden gems in your data. Ask questions, and let our AI 
              reveal valuable insights from your information.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <LoadingMessage />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
