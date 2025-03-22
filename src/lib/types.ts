
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  embedding?: number[];
  metadata?: {
    project?: string;
    tags?: string[];
    owner?: string;
    taskManager?: string;
    taskOwner?: string;
    category?: string;
    keywords?: string[];
    year?: number;
    quarter?: string;
    department?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
    assignee?: string;
    lastModified?: Date;
    relationId?: string;
    parentTask?: string;
    dependsOn?: string[];
    blockedBy?: string[];
    estimatedHours?: number;
    actualHours?: number;
    completionPercentage?: number;
  };
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

// File upload related types
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  messagesCount?: number;
  error?: string;
  timestamp: Date;
}

export interface UploadStats {
  totalFiles: number;
  processedFiles: number;
  totalMessages: number;
  processedMessages: number;
}

export interface EmbeddingVisualizationData {
  id: string;
  x: number;
  y: number;
  group: MessageRole;
  content: string;
  similarity?: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface MessageTableFilters {
  role?: MessageRole[];
  project?: string[];
  owner?: string[];
  taskManager?: string[];
  taskOwner?: string[];
  year?: number[];
  tags?: string[];
  search?: string;
  department?: string[];
  priority?: string[];
  status?: string[];
  category?: string[];
}

// Local storage keys
export const STORAGE_KEYS = {
  FILES: 'vector-knowledge-files',
  MESSAGES: 'vector-knowledge-messages',
  VISUALIZATION_DATA: 'vector-knowledge-visualization',
  STATS: 'vector-knowledge-stats'
};
