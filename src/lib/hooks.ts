
import { useState, useRef, useEffect } from "react";
import { Message } from "./types";
import { vectorDb } from "./vectorDb";

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
    const userMessage = addMessage({ 
      role: "user", 
      content,
      embedding: vectorDb.generateEmbedding(content)
    });
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Generate embedding for the query
      const queryEmbedding = vectorDb.generateEmbedding(content);
      
      // Search for relevant knowledge
      const searchResults = vectorDb.search(queryEmbedding, 3);
      
      // Generate response based on vector search results
      let response: string;
      
      if (searchResults.length > 0) {
        // Use the most relevant knowledge to generate a response
        const relevantKnowledge = searchResults
          .map(result => `- ${result.entry.content}`)
          .join('\n');
        
        response = `Based on my knowledge:\n\n${relevantKnowledge}\n\nIs there anything specific about these concepts you'd like to explore further?`;
      } else {
        // Fallback to simple responses if no relevant knowledge is found
        response = generateBasicResponse(content);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add assistant response
      addMessage({ 
        role: "assistant", 
        content: response,
        embedding: vectorDb.generateEmbedding(response)
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple response generator for fallback
  const generateBasicResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! I'm your Knowledge Assistant. You can ask me about vector databases, embedding management, or knowledge retrieval systems.";
    } else if (lowerCaseMessage.includes("vector")) {
      return "Vector databases store and retrieve data based on semantic similarity rather than exact matching. They're essential for modern AI systems that work with embeddings.";
    } else if (lowerCaseMessage.includes("embedding")) {
      return "Embeddings are numerical representations of data (like text or images) that capture semantic meaning in a way that machines can understand and compare.";
    } else if (lowerCaseMessage.includes("help")) {
      return "I can provide information about vector databases, two-way access systems, embedding management, and other related topics. What specifically would you like to learn about?";
    } else {
      return "I understand you're asking about \"" + userMessage + "\". While I have knowledge about vector databases and embedding systems, I don't have specific information about this query. Could you ask about vector databases, embeddings, or knowledge retrieval?";
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
