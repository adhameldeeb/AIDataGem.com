
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { supabase } from '../supabase';

interface LLMModel {
  id: string;
  name: string;
  provider: string;
  apiKey?: string;
  defaultModel: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EmbeddingModel {
  id: string;
  name: string;
  provider: string;
  apiKey?: string;
  defaultModel: boolean;
  dimensions: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ModelsStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.MODELS);
  }
  
  async saveLLMModels(models: LLMModel[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedModels = models.map(model => ({
        ...model,
        createdAt: model.createdAt.toISOString(),
        updatedAt: model.updatedAt.toISOString()
      }));
      
      await this.upsertData(formattedModels);
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
        createdAt: new Date(model.createdAt),
        updatedAt: new Date(model.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading LLM models from Supabase:', error);
      return [];
    }
  }
  
  async saveEmbeddingModels(models: EmbeddingModel[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedModels = models.map(model => ({
        ...model,
        createdAt: model.createdAt.toISOString(),
        updatedAt: model.updatedAt.toISOString()
      }));
      
      const { error } = await supabase
        .from(TABLES.EMBEDDING_MODELS)
        .upsert(formattedModels);
        
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
        createdAt: new Date(model.createdAt),
        updatedAt: new Date(model.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading embedding models from Supabase:', error);
      return [];
    }
  }
}
