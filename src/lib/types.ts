
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  embedding?: number[]; // Vector embedding for the message content
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

// Vector database related types
export interface VectorEntry {
  id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export interface SearchResult {
  entry: VectorEntry;
  similarity: number;
}
