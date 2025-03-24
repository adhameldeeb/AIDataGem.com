
import { supabase, TABLES } from './supabase';
import { 
  Message, 
  UploadedFile, 
  UploadStats, 
  LLMModel, 
  EmbeddingModel, 
  Project,
  Process
} from './types';

class SupabaseStorageService {
  // Messages
  async saveMessages(messages: Message[]): Promise<void> {
    try {
      // Transform dates to ISO strings for storage
      const formattedMessages = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
        metadata: msg.metadata ? {
          ...msg.metadata,
          lastModified: msg.metadata.lastModified 
            ? msg.metadata.lastModified.toISOString()
            : null
        } : null
      }));
      
      // Upsert messages (insert or update)
      const { error } = await supabase
        .from(TABLES.MESSAGES)
        .upsert(formattedMessages, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving messages to Supabase:', error);
    }
  }

  async loadMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MESSAGES)
        .select('*')
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      // Transform strings back to Date objects
      return (data || []).map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        metadata: msg.metadata ? {
          ...msg.metadata,
          lastModified: msg.metadata.lastModified 
            ? new Date(msg.metadata.lastModified)
            : undefined
        } : undefined
      }));
    } catch (error) {
      console.error('Error loading messages from Supabase:', error);
      return [];
    }
  }

  // Files
  async saveFiles(files: UploadedFile[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedFiles = files.map(file => ({
        ...file,
        timestamp: file.timestamp.toISOString()
      }));
      
      const { error } = await supabase
        .from(TABLES.FILES)
        .upsert(formattedFiles, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving files to Supabase:', error);
    }
  }

  async loadFiles(): Promise<UploadedFile[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.FILES)
        .select('*');
      
      if (error) throw error;
      
      // Transform date strings back to Date objects
      return (data || []).map(file => ({
        ...file,
        timestamp: new Date(file.timestamp)
      }));
    } catch (error) {
      console.error('Error loading files from Supabase:', error);
      return [];
    }
  }

  // Stats
  async saveStats(stats: UploadStats): Promise<void> {
    try {
      // We'll store stats in a special row with id='current'
      const { error } = await supabase
        .from('stats')
        .upsert({ 
          id: 'current',
          ...stats
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving stats to Supabase:', error);
    }
  }

  async loadStats(): Promise<UploadStats> {
    try {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('id', 'current')
        .single();
      
      if (error) throw error;
      
      return data || {
        totalFiles: 0,
        processedFiles: 0,
        totalMessages: 0,
        processedMessages: 0
      };
    } catch (error) {
      console.error('Error loading stats from Supabase:', error);
      return {
        totalFiles: 0,
        processedFiles: 0,
        totalMessages: 0,
        processedMessages: 0
      };
    }
  }

  // Visualization data
  async saveVisualizationData(data: any[]): Promise<void> {
    try {
      // For visualization data, we'll store each point separately
      const formattedData = data.map(point => ({
        id: point.id || crypto.randomUUID(),
        data: point
      }));
      
      const { error } = await supabase
        .from(TABLES.VISUALIZATIONS)
        .upsert(formattedData, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving visualization data to Supabase:', error);
    }
  }

  async loadVisualizationData(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.VISUALIZATIONS)
        .select('data');
      
      if (error) throw error;
      
      return (data || []).map(item => item.data);
    } catch (error) {
      console.error('Error loading visualization data from Supabase:', error);
      return [];
    }
  }

  // Models configuration
  async saveLLMModels(models: LLMModel[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedModels = models.map(model => ({
        ...model,
        lastUsed: model.lastUsed ? model.lastUsed.toISOString() : null
      }));
      
      const { error } = await supabase
        .from(TABLES.MODELS)
        .upsert(formattedModels, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving LLM models to Supabase:', error);
    }
  }

  async loadLLMModels(): Promise<LLMModel[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MODELS)
        .select('*');
      
      if (error) throw error;
      
      // Transform date strings back to Date objects
      return (data || []).map(model => ({
        ...model,
        lastUsed: model.lastUsed ? new Date(model.lastUsed) : undefined
      }));
    } catch (error) {
      console.error('Error loading LLM models from Supabase:', error);
      return [];
    }
  }

  // Embedding models
  async saveEmbeddingModels(models: EmbeddingModel[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedModels = models.map(model => ({
        ...model,
        lastUsed: model.lastUsed ? model.lastUsed.toISOString() : null
      }));
      
      const { error } = await supabase
        .from(TABLES.EMBEDDING_MODELS)
        .upsert(formattedModels, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving embedding models to Supabase:', error);
    }
  }

  async loadEmbeddingModels(): Promise<EmbeddingModel[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.EMBEDDING_MODELS)
        .select('*');
      
      if (error) throw error;
      
      // Transform date strings back to Date objects
      return (data || []).map(model => ({
        ...model,
        lastUsed: model.lastUsed ? new Date(model.lastUsed) : undefined
      }));
    } catch (error) {
      console.error('Error loading embedding models from Supabase:', error);
      return [];
    }
  }

  // Projects
  async saveProjects(projects: Project[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedProjects = projects.map(project => ({
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString()
      }));
      
      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .upsert(formattedProjects, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving projects to Supabase:', error);
    }
  }

  async loadProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*');
      
      if (error) throw error;
      
      // Transform date strings back to Date objects
      return (data || []).map(project => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading projects from Supabase:', error);
      return [];
    }
  }

  // Secrets management for API keys
  async saveSecret(key: string, value: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.SECRETS)
        .upsert({ 
          id: key,
          value: value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving secret to Supabase:', error);
    }
  }

  async getSecret(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SECRETS)
        .select('value')
        .eq('id', key)
        .single();
      
      if (error) throw error;
      
      return data?.value || null;
    } catch (error) {
      console.error('Error getting secret from Supabase:', error);
      return null;
    }
  }

  async deleteSecret(key: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.SECRETS)
        .delete()
        .eq('id', key);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting secret from Supabase:', error);
    }
  }

  async listSecrets(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SECRETS)
        .select('id');
      
      if (error) throw error;
      
      return (data || []).map(item => item.id);
    } catch (error) {
      console.error('Error listing secrets from Supabase:', error);
      return [];
    }
  }

  // Process tracking
  async saveProcess(process: Process): Promise<void> {
    try {
      const formattedProcess = {
        ...process,
        startTime: process.startTime.toISOString(),
        endTime: process.endTime ? process.endTime.toISOString() : null
      };
      
      const { error } = await supabase
        .from(TABLES.PROCESSES)
        .upsert(formattedProcess, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving process to Supabase:', error);
    }
  }

  async loadProcesses(): Promise<Process[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROCESSES)
        .select('*');
      
      if (error) throw error;
      
      return (data || []).map(process => ({
        ...process,
        startTime: new Date(process.startTime),
        endTime: process.endTime ? new Date(process.endTime) : undefined
      }));
    } catch (error) {
      console.error('Error loading processes from Supabase:', error);
      return [];
    }
  }

  // Clear all data (for admin purposes)
  async clearAll(): Promise<void> {
    try {
      // Clear each table
      for (const table of Object.values(TABLES)) {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', 'dummy_to_match_nothing'); // Delete all rows
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error clearing all data from Supabase:', error);
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();
