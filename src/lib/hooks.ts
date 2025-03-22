
import { useState, useRef, useEffect } from "react";
import { Message } from "./types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...message,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };
  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addMessage({ role: "user", content });
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add assistant response
      const response = generateResponse(content);
      addMessage({ role: "assistant", content: response });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple response generator for demo
  const generateResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I assist you today?";
    } else if (lowerCaseMessage.includes("help")) {
      return "I'm here to help! You can ask me questions, and I'll do my best to provide useful information.";
    } else if (lowerCaseMessage.includes("thank")) {
      return "You're welcome! Feel free to ask if you need anything else.";
    } else if (lowerCaseMessage.includes("how are you")) {
      return "I'm functioning well, thank you for asking. How can I help you today?";
    } else {
      return "I understand you're asking about \"" + userMessage + "\". While I'm just a simple demo right now, the full version would provide a helpful and detailed response to your query.";
    }
  };
  
  return {
    messages,
    isLoading,
    sendMessage,
  };
}

export function useScrollToBottom() {
  const ref = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };
  
  return { ref, scrollToBottom };
}

export function useAutoScroll(dependency: any[]) {
  const { ref, scrollToBottom } = useScrollToBottom();
  
  useEffect(() => {
    scrollToBottom();
  }, [dependency, scrollToBottom]);
  
  return { ref };
}
