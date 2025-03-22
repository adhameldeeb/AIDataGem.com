
import { Message, EmbeddingVisualizationData } from "./types";
import { vectorDb } from "./vectorDb";

export async function processChatHistory(
  file: File, 
  onProgress: (progress: number) => void
): Promise<{ 
  messages: Message[], 
  visualizationPoints: EmbeddingVisualizationData[] 
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }
        
        const content = event.target.result as string;
        const chatData = JSON.parse(content);
        
        // Extract messages from potential nested structure
        const messages = extractMessages(chatData);
        
        if (!messages || messages.length === 0) {
          throw new Error("No valid messages found in file");
        }
        
        // Process messages and generate embeddings
        const processedMessages: Message[] = [];
        const visualizationPoints: EmbeddingVisualizationData[] = [];
        
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          
          // Generate embedding
          const embedding = vectorDb.generateEmbedding(message.content);
          
          // Create proper message object
          const processedMessage: Message = {
            id: message.id || crypto.randomUUID(),
            role: message.role || "user",
            content: message.content,
            timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
            embedding
          };
          
          // Create visualization point using PCA-like dimension reduction
          // This is a very simplified version for demonstration
          const [x, y] = simplifiedDimensionReduction(embedding);
          
          const visualPoint: EmbeddingVisualizationData = {
            id: processedMessage.id,
            x,
            y,
            group: processedMessage.role,
            content: processedMessage.content
          };
          
          processedMessages.push(processedMessage);
          visualizationPoints.push(visualPoint);
          
          // Update progress
          onProgress(Math.round((i + 1) / messages.length * 100));
          
          // Small delay to avoid UI freeze
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        resolve({ messages: processedMessages, visualizationPoints });
      } catch (error) {
        console.error("Error parsing file:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
}

// Extract messages from potentially nested structure - Improved for ChatGPT exports
function extractMessages(data: any): any[] {
  // Add debug logging
  console.log("Extracting messages from data structure:", JSON.stringify(data).substring(0, 500) + "...");
  
  // Handle ChatGPT export format directly
  if (data.mapping && typeof data.mapping === 'object') {
    console.log("ChatGPT export format detected with mapping object");
    const messages: any[] = [];
    
    // Process each conversation node in the mapping
    for (const nodeId in data.mapping) {
      const node = data.mapping[nodeId];
      
      if (node && node.message && typeof node.message === 'object') {
        const message = node.message;
        
        // Skip if not a content message
        if (!message.content || !message.content.parts) continue;
        
        // Get the content from parts array and join if needed
        const contentParts = message.content.parts || [];
        const content = contentParts.join("\n").trim();
        
        if (content) {
          messages.push({
            id: nodeId,
            role: message.author?.role || "user",
            content: content,
            timestamp: message.create_time ? new Date(message.create_time * 1000) : new Date()
          });
        }
      }
    }
    
    console.log(`Found ${messages.length} messages in ChatGPT export format`);
    if (messages.length > 0) return messages;
  }
  
  // Handle conversation array format
  if (data.conversations && Array.isArray(data.conversations)) {
    console.log("Conversations array format detected");
    return data.conversations.flatMap((conversation: any) => {
      if (conversation.messages && Array.isArray(conversation.messages)) {
        return conversation.messages.map((msg: any) => ({
          id: msg.id || crypto.randomUUID(),
          role: msg.role || "user",
          content: typeof msg.content === 'string' ? msg.content : 
                   (msg.content?.parts ? msg.content.parts.join("\n") : ""),
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }));
      }
      return [];
    });
  }
  
  // Standard array of messages format
  if (Array.isArray(data)) {
    if (data.length > 0 && data[0].content && typeof data[0].content === 'string') {
      console.log("Standard array of messages format detected");
      return data;
    } else {
      // Try to find messages in the array items
      console.log("Searching through array items for messages");
      return data.flatMap(item => extractMessages(item));
    }
  } else if (typeof data === 'object' && data !== null) {
    // Try specific known properties
    if (data.messages && Array.isArray(data.messages)) {
      console.log("Found messages array property");
      return data.messages;
    } else if (data.content && typeof data.content === 'string') {
      // This might be a single message
      console.log("Found single message object");
      return [data];
    } else {
      // Try all object properties
      console.log("Searching through all object properties for messages");
      return Object.values(data).flatMap(value => extractMessages(value));
    }
  }
  
  console.log("No messages found in current data structure");
  return [];
}

// Simplified dimension reduction for visualization
// In a real implementation, you'd use PCA, t-SNE, or UMAP
function simplifiedDimensionReduction(embedding: number[]): [number, number] {
  if (embedding.length < 2) {
    return [0, 0];
  }
  
  // Sum odd and even indices to get two components
  let xSum = 0;
  let ySum = 0;
  
  for (let i = 0; i < embedding.length; i++) {
    if (i % 2 === 0) {
      xSum += embedding[i];
    } else {
      ySum += embedding[i];
    }
  }
  
  // Normalize to [-1, 1] range
  const norm = Math.max(Math.abs(xSum), Math.abs(ySum)) || 1;
  return [xSum / norm, ySum / norm];
}
