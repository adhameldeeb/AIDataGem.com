
import React, { useState } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { Message, MessageRole } from "@/lib/types";

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
        project: "datafromai.com",
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
          project: "datafromai.com",
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
        <h2 className="text-lg font-semibold">DataFromAI Chat</h2>
        <p className="text-sm text-muted-foreground">Ask questions about your data</p>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

// Simple AI response generator for demonstration
function generateAIResponse(userInput: string): string {
  const lowercaseInput = userInput.toLowerCase();
  
  if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
    return "Hello! I'm your DataFromAI assistant. How can I help you analyze your data today?";
  }
  
  if (lowercaseInput.includes("data") || lowercaseInput.includes("analytics")) {
    return "DataFromAI provides advanced analytics with natural language processing. You can ask questions about your data, and I'll help you extract insights, generate visualizations, and identify patterns or anomalies.";
  }
  
  if (lowercaseInput.includes("embed") || lowercaseInput.includes("vector")) {
    return "Our system uses state-of-the-art embedding techniques to convert your text and data into rich vector representations. This allows for semantic search, similarity matching, and contextual understanding of your information.";
  }
  
  if (lowercaseInput.includes("feature") || lowercaseInput.includes("capability")) {
    return "DataFromAI offers several key features:\n\n1. Natural language data querying\n2. Automated insights generation\n3. Vector embeddings for semantic search\n4. Contextual memory of previous interactions\n5. Multi-format data integration\n6. Customizable visualization generation";
  }
  
  return "I understand you're interested in AI-powered data analysis. DataFromAI specializes in making your data accessible through natural language. What specific insights are you looking to gain from your data?";
}
