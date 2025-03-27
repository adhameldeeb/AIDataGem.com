
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';

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

interface LLMModelRecord {
  id: string;
  name: string;
  provider: string;
  apiKey?: string;
  defaultModel: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmbeddingModelRecord {
  id: string;
  name: string;
  provider: string;
  apiKey?: string;
  defaultModel: boolean;
  dimensions: number;
  createdAt: string;
  updatedAt: string;
}

export class ModelsStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.MODELS);
  }
  
  async saveLLMModels(models: LLMModel[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedModels = models.map(model => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        apiKey: model.apiKey,
        defaultModel: model.defaultModel,
        createdAt: model.createdAt.toISOString(),
        updatedAt: model.updatedAt.toISOString()
      }));
      
      await this.upsertData(formattedModels);
    } catch (error) {
      console.error('Error saving LLM models:', error);
    }
  }
  
  async loadLLMModels(): Promise<LLMModel[]> {
    try {
      const models = await this.loadData<LLMModelRecord>();
      
      // Transform date strings back to Date objects
      return models.map(model => ({
        ...model,
        createdAt: new Date(model.createdAt),
        updatedAt: new Date(model.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading LLM models:', error);
      return [];
    }
  }
  
  async saveEmbeddingModels(models: EmbeddingModel[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedModels = models.map(model => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        apiKey: model.apiKey,
        defaultModel: model.defaultModel,
        dimensions: model.dimensions,
        createdAt: model.createdAt.toISOString(),
        updatedAt: model.updatedAt.toISOString()
      }));
      
      await this.upsertData(formattedModels);
    } catch (error) {
      console.error('Error saving embedding models:', error);
    }
  }
  
  async loadEmbeddingModels(): Promise<EmbeddingModel[]> {
    try {
      const models = await this.loadData<EmbeddingModelRecord>();
      
      // Transform date strings back to Date objects
      return models.map(model => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        apiKey: model.apiKey,
        defaultModel: model.defaultModel,
        dimensions: model.dimensions,
        createdAt: new Date(model.createdAt),
        updatedAt: new Date(model.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading embedding models:', error);
      return [];
    }
  }
}
