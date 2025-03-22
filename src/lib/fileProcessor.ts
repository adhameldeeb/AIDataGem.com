
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
        console.log("File content type:", typeof content);
        console.log("File content length:", content.length);
        
        let chatData;
        try {
          chatData = JSON.parse(content);
          console.log("Successfully parsed JSON");
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error(`Invalid JSON format: ${parseError.message}`);
        }
        
        // Extract messages from potential nested structure
        const messages = extractMessages(chatData);
        console.log("Extracted messages count:", messages.length);
        
        if (!messages || messages.length === 0) {
          console.error("No messages found in file:", file.name);
          throw new Error("No valid messages found in file");
        }
        
        // Extract metadata from file name and content
        const fileMetadata = extractFileMetadata(file.name, chatData);
        
        // Process messages and generate embeddings
        const processedMessages: Message[] = [];
        const visualizationPoints: EmbeddingVisualizationData[] = [];
        
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          
          // Generate embedding
          const embedding = vectorDb.generateEmbedding(message.content);
          
          // Extract message-specific metadata
          const messageMetadata = extractMessageMetadata(message.content, message.role);
          
          // Merge file-level and message-level metadata
          const combinedMetadata = {
            ...fileMetadata,
            ...messageMetadata
          };
          
          // Create proper message object
          const processedMessage: Message = {
            id: message.id || crypto.randomUUID(),
            role: message.role || "user",
            content: message.content,
            timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
            embedding,
            metadata: Object.keys(combinedMetadata).length > 0 ? combinedMetadata : undefined
          };
          
          // Create visualization point using PCA-like dimension reduction
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
        
        console.log("Successfully processed all messages:", processedMessages.length);
        resolve({ messages: processedMessages, visualizationPoints });
      } catch (error) {
        console.error("Error processing file:", file.name, error);
        reject(error);
      }
    };
    
    reader.onerror = (event) => {
      console.error("FileReader error:", event);
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
}

// Extract metadata from filename and chat data
function extractFileMetadata(filename: string, chatData: any): Record<string, any> {
  const metadata: Record<string, any> = {};
  
  // Extract project from filename if it contains a recognizable pattern
  const filenameMatch = filename.match(/ChatGPT_\d{4}-\d{2}-\d{2}_(.+)\.json/);
  if (filenameMatch && filenameMatch[1]) {
    const projectName = filenameMatch[1].replace(/_/g, ' ');
    metadata.project = projectName;
  }
  
  // Extract data from chat title if available
  if (chatData.title) {
    metadata.project = metadata.project || chatData.title;
  }

  // Try to extract creation date from filename or metadata
  const dateMatch = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const [_, year, month, day] = dateMatch;
    metadata.year = parseInt(year);
    
    // Determine quarter
    const monthNum = parseInt(month);
    if (monthNum <= 3) metadata.quarter = 'Q1';
    else if (monthNum <= 6) metadata.quarter = 'Q2';
    else if (monthNum <= 9) metadata.quarter = 'Q3';
    else metadata.quarter = 'Q4';
  }
  
  // Extract create time from chat data if available
  if (chatData.create_time && typeof chatData.create_time === 'number') {
    const date = new Date(chatData.create_time * 1000);
    metadata.year = date.getFullYear();
    
    // Determine quarter
    const month = date.getMonth() + 1;
    if (month <= 3) metadata.quarter = 'Q1';
    else if (month <= 6) metadata.quarter = 'Q2';
    else if (month <= 9) metadata.quarter = 'Q3';
    else metadata.quarter = 'Q4';
  }
  
  return metadata;
}

// Extract metadata from message content using enhanced NLP techniques
function extractMessageMetadata(content: string, role: string): Record<string, any> {
  const metadata: Record<string, any> = {};
  const lowerContent = content.toLowerCase();
  
  // Extract potential tags (words with # prefix or keywords)
  const tagMatches = content.match(/#[a-zA-Z0-9_]+/g);
  if (tagMatches && tagMatches.length > 0) {
    metadata.tags = tagMatches.map(tag => tag.substring(1));
  }
  
  // Look for project information
  const projectMatch = lowerContent.match(/project[:\s]+([^.,\n]+)/i);
  if (projectMatch && projectMatch[1]) {
    metadata.project = projectMatch[1].trim();
  }
  
  // Look for owner information
  const ownerMatch = lowerContent.match(/(?:owner|by)[:\s]+([^.,\n]+)/i);
  if (ownerMatch && ownerMatch[1]) {
    metadata.owner = ownerMatch[1].trim();
  }
  
  // Look for task manager
  const taskManagerMatch = lowerContent.match(/(?:task manager|manager)[:\s]+([^.,\n]+)/i);
  if (taskManagerMatch && taskManagerMatch[1]) {
    metadata.taskManager = taskManagerMatch[1].trim();
  }
  
  // Look for task owner
  const taskOwnerMatch = lowerContent.match(/task owner[:\s]+([^.,\n]+)/i);
  if (taskOwnerMatch && taskOwnerMatch[1]) {
    metadata.taskOwner = taskOwnerMatch[1].trim();
  }
  
  // Extract year mentions
  const yearMatches = content.match(/\b(20\d{2})\b/g);
  if (yearMatches && yearMatches.length > 0) {
    metadata.year = parseInt(yearMatches[0]);
  }
  
  // Extract priority information
  const priorityMatch = lowerContent.match(/priority[:\s]+([^.,\n]+)/i);
  if (priorityMatch && priorityMatch[1]) {
    metadata.priority = priorityMatch[1].trim();
  } else if (lowerContent.includes("high priority") || lowerContent.includes("urgent")) {
    metadata.priority = "high";
  } else if (lowerContent.includes("medium priority")) {
    metadata.priority = "medium";
  } else if (lowerContent.includes("low priority")) {
    metadata.priority = "low";
  }
  
  // Extract status information
  const statusMatch = lowerContent.match(/status[:\s]+([^.,\n]+)/i);
  if (statusMatch && statusMatch[1]) {
    metadata.status = statusMatch[1].trim();
  } else if (lowerContent.includes("completed") || lowerContent.includes("done")) {
    metadata.status = "completed";
  } else if (lowerContent.includes("in progress") || lowerContent.includes("ongoing")) {
    metadata.status = "in progress";
  } else if (lowerContent.includes("pending") || lowerContent.includes("to do")) {
    metadata.status = "pending";
  }
  
  // Extract department information
  const departmentMatch = lowerContent.match(/department[:\s]+([^.,\n]+)/i);
  if (departmentMatch && departmentMatch[1]) {
    metadata.department = departmentMatch[1].trim();
  } else if (lowerContent.includes("engineering") || lowerContent.includes("development")) {
    metadata.department = "engineering";
  } else if (lowerContent.includes("marketing")) {
    metadata.department = "marketing";
  } else if (lowerContent.includes("sales")) {
    metadata.department = "sales";
  } else if (lowerContent.includes("design")) {
    metadata.department = "design";
  } else if (lowerContent.includes("product")) {
    metadata.department = "product";
  } else if (lowerContent.includes("hr") || lowerContent.includes("human resources")) {
    metadata.department = "hr";
  }
  
  // Extract category information
  const categoryMatch = lowerContent.match(/category[:\s]+([^.,\n]+)/i);
  if (categoryMatch && categoryMatch[1]) {
    metadata.category = categoryMatch[1].trim();
  } else if (lowerContent.includes("feature")) {
    metadata.category = "feature";
  } else if (lowerContent.includes("bug")) {
    metadata.category = "bug";
  } else if (lowerContent.includes("enhancement")) {
    metadata.category = "enhancement";
  } else if (lowerContent.includes("documentation")) {
    metadata.category = "documentation";
  }
  
  // Extract estimated hours
  const estimatedHoursMatch = content.match(/estimated(?:\s+time|\s+hours)?[:\s]+(\d+(?:\.\d+)?)/i);
  if (estimatedHoursMatch && estimatedHoursMatch[1]) {
    metadata.estimatedHours = parseFloat(estimatedHoursMatch[1]);
  }
  
  // If no tags were found, try to extract keywords
  if (!metadata.tags) {
    const keywords = extractKeywords(content);
    if (keywords.length > 0) {
      metadata.tags = keywords;
    }
  }
  
  return metadata;
}

// Enhanced keyword extraction with expanded technical terms
function extractKeywords(text: string): string[] {
  // List of common technical terms to look for
  const technicalTerms = [
    // Technical
    'api', 'code', 'data', 'file', 'function', 'server', 'client',
    'database', 'web', 'cloud', 'security', 'network', 'storage',
    'config', 'deploy', 'docker', 'kubernetes', 'aws', 'azure',
    'react', 'angular', 'vue', 'node', 'python', 'java', 'javascript',
    'ai', 'ml', 'analytics', 'algorithm', 'architecture', 'automation',
    'backend', 'frontend', 'fullstack', 'devops', 'microservice', 
    'infrastructure', 'scaling', 'testing', 'monitoring',
    
    // Business
    'strategy', 'roadmap', 'milestone', 'objective', 'kpi', 'metric',
    'budget', 'cost', 'revenue', 'profit', 'market', 'customer',
    'presentation', 'report', 'analysis', 'forecast', 'planning',
    
    // Project management
    'task', 'project', 'sprint', 'backlog', 'priority', 'deadline',
    'meeting', 'review', 'feedback', 'stakeholder', 'requirement',
    'agile', 'scrum', 'kanban', 'waterfall', 'milestone',
    
    // Communication
    'email', 'slack', 'teams', 'chat', 'call', 'interview', 'discussion',
    'presentation', 'documentation', 'wiki', 'knowledge base'
  ];
  
  const words = text.toLowerCase().split(/\W+/);
  const keywords = technicalTerms.filter(term => words.includes(term));
  
  // Extract multi-word technical phrases
  const phrases = [
    'machine learning', 'deep learning', 'neural network', 'natural language processing',
    'data science', 'data analysis', 'data engineering', 'business intelligence',
    'project management', 'product development', 'user experience', 'user interface',
    'continuous integration', 'continuous deployment', 'version control',
    'artificial intelligence', 'business strategy', 'market analysis'
  ];
  
  const lowerText = text.toLowerCase();
  const foundPhrases = phrases.filter(phrase => lowerText.includes(phrase));
  
  // Combine single words and phrases, remove duplicates
  return [...new Set([...keywords, ...foundPhrases])];
}

// Extract messages from potentially nested structure - Improved for ChatGPT exports
function extractMessages(data: any): any[] {
  // Add debug logging
  console.log("Extracting messages from data structure type:", typeof data);
  if (typeof data === 'object') {
    console.log("Object keys:", Object.keys(data));
  }
  
  // Handle ChatGPT export format with mapping structure
  if (data.mapping && typeof data.mapping === 'object') {
    console.log("ChatGPT export format detected with mapping object");
    const messages: any[] = [];
    
    // Process each conversation node in the mapping
    for (const nodeId in data.mapping) {
      const node = data.mapping[nodeId];
      
      if (node && node.message && typeof node.message === 'object') {
        const message = node.message;
        
        // Skip if not a content message or system hidden message
        if (!message.content || !message.content.parts) continue;
        
        // Get the content from parts array and join if needed
        const contentParts = message.content.parts || [];
        const content = contentParts.join("\n").trim();
        
        // Skip empty messages
        if (!content) continue;
        
        // Skip visually hidden messages (system messages that don't appear in chat)
        if (message.metadata?.is_visually_hidden_from_conversation === true) continue;
        
        messages.push({
          id: nodeId,
          role: message.author?.role || "user",
          content: content,
          timestamp: message.create_time ? new Date(message.create_time * 1000) : new Date()
        });
      }
    }
    
    console.log(`Found ${messages.length} messages in ChatGPT export format`);
    
    // Sort messages by timestamp
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
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
