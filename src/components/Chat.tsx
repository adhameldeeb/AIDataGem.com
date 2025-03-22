
import React, { useState } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { Message } from "@/lib/types";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
      metadata: {
        owner: "User",
        project: "aidatagem.com",
        tags: ["query", "user-input"],
        department: "Customer",
        conversationId: "live-session"
      }
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    // Set loading state while "AI" prepares response
    setIsLoading(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create AI response
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: generateAIResponse(content),
        timestamp: new Date(),
        metadata: {
          owner: "AI Assistant",
          project: "aidatagem.com",
          tags: ["response", "ai-generated"],
          department: "AI",
          conversationId: "live-session"
        }
      };
      
      // Add AI response to chat
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background border rounded-lg shadow-sm">
      <div className="border-b px-4 py-2">
        <h2 className="text-lg font-semibold">AIDatagem Chat</h2>
        <p className="text-sm text-muted-foreground">Unlock the hidden gems in your data</p>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

// AI response generator with AIDatagem messaging
function generateAIResponse(userInput: string): string {
  const lowercaseInput = userInput.toLowerCase();
  
  if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
    return "Hello! I'm your AIDatagem assistant. How can I help you discover valuable insights from your data today?";
  }
  
  if (lowercaseInput.includes("data") || lowercaseInput.includes("analytics")) {
    return "AIDatagem transforms raw data into valuable gems of insight. Our advanced AI analyzes your data to extract valuable patterns, trends, and actionable intelligence that would otherwise remain hidden.";
  }
  
  if (lowercaseInput.includes("embed") || lowercaseInput.includes("vector")) {
    return "Our gem-cutting technology uses state-of-the-art vector embeddings to transform your unstructured data into multidimensional representations. This allows for semantic search, similarity matching, and deep contextual understanding of your information assets.";
  }
  
  if (lowercaseInput.includes("feature") || lowercaseInput.includes("capability")) {
    return "AIDatagem offers several key features:\n\n1. Semantic data mining with natural language queries\n2. Automated insight extraction and gem identification\n3. Multi-dimensional vector embedding for precise search\n4. Contextual memory across your entire data landscape\n5. Rich metadata tagging and classification\n6. Interactive visualization of data relationships";
  }
  
  return "AIDatagem specializes in cutting through the noise to find the true gems in your data. Our AI systems can process, analyze, and extract valuable insights from complex datasets, making the hidden value in your information accessible and actionable. What specific insights are you looking to uncover?";
}
