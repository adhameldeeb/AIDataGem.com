
import React from "react";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/lib/hooks";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto bg-card shadow-sm">
      <div className="relative flex flex-col flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
