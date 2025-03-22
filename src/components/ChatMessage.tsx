
import React from "react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LoadingDots } from "./LoadingDots";

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div 
      className={cn(
        "animate-fade-up flex w-full px-4 py-6 md:px-6",
        isUser ? "justify-end" : "justify-start"
      )}
      style={{ 
        animationFillMode: "backwards", 
        animationDelay: "0.1s" 
      }}
    >
      <div 
        className={cn(
          "relative flex max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3.5 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground ml-4" 
            : "bg-chat-assistant border border-border mr-4"
        )}
      >
        <div className="overflow-hidden break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="animate-fade-up flex w-full px-4 py-6 md:px-6 justify-start">
      <div className="bg-chat-assistant border border-border mr-4 relative flex max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3.5 shadow-sm">
        <LoadingDots />
      </div>
    </div>
  );
}
