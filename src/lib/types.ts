
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
    conversationId?: string;
    threadId?: string;
    sourceFile?: string;
    subject?: string;     // New: For subject matter categorization
    sessionId?: string;   // New: To track separate chat sessions
    processId?: string;   // New: For tracking processing operations
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
  subject?: string[];     // New: For subject filtering
  session?: string[];     // New: For session filtering
}

// Local storage keys
export const STORAGE_KEYS = {
  FILES: 'vector-knowledge-files',
  MESSAGES: 'vector-knowledge-messages',
  VISUALIZATION_DATA: 'vector-knowledge-visualization',
  STATS: 'vector-knowledge-stats',
  MODELS: 'vector-knowledge-models',
  PROJECTS: 'vector-knowledge-projects',
  EMBEDDING_MODEL: 'vector-knowledge-embedding-model',
  PROCESSES: 'vector-knowledge-processes' // New: For tracking processing operations
};

// LLM and embedding model types
export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  apiKey?: string;
  apiEndpoint?: string;
  priority: number;
  status: 'active' | 'inactive';
  type: 'llm' | 'embedding';
  contextWindow?: number;
  maxTokens?: number;
  costPer1kTokens?: number;
  metadata?: Record<string, any>;
  isSecured?: boolean;    // New: Flag for secured API credentials
  lastUsed?: Date;        // New: Track when model was last used
}

export interface EmbeddingModel {
  id: string;
  name: string;
  provider: string;
  dimensions: number;
  apiKey?: string;
  apiEndpoint?: string;
  status: 'active' | 'inactive';
  isDefault: boolean;
  metadata?: Record<string, any>;
  isSecured?: boolean;    // New: Flag for secured API credentials
  lastUsed?: Date;        // New: Track when model was last used
}

// Project management types
export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  status: 'active' | 'archived';
  metadata?: Record<string, any>;
  subjects?: string[];    // New: List of subjects in this project
  tags?: string[];        // New: Project tags for organization
  owner?: string;         // New: Project owner
  priority?: string;      // New: Project priority
}

// Database status types
export interface DatabaseStatus {
  connected: boolean;
  totalDocuments: number;
  totalConversations: number;
  vectorStore: {
    embeddings: number;
    storageSize: number;
  };
}

// New: Process tracking types
export interface Process {
  id: string;
  name: string;
  type: 'import' | 'export' | 'embedding' | 'analysis' | 'custom';
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
  metadata?: Record<string, any>;
  result?: any;
}
