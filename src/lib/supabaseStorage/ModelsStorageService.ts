
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { LLMModel, EmbeddingModel } from '../types';

export class ModelsStorageService extends BaseStorageService {
  private embeddingModelsTable: string;

  constructor() {
    super(TABLES.MODELS);
    this.embeddingModelsTable = TABLES.EMBEDDING_MODELS;
  }

  async saveLLMModels(models: LLMModel[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedModels = models.map(model => ({
        ...model,
        lastUsed: model.lastUsed ? model.lastUsed.toISOString() : null
      }));
      
      await this.upsertData(formattedModels);
    } catch (error) {
      console.error('Error saving LLM models to Supabase:', error);
    }
  }

  async loadLLMModels(): Promise<LLMModel[]> {
    try {
      const data = await this.loadData<any>();
      
      // Transform date strings back to Date objects
      return data.map(model => ({
        ...model,
        lastUsed: model.lastUsed ? new Date(model.lastUsed) : undefined
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
        lastUsed: model.lastUsed ? model.lastUsed.toISOString() : null
      }));
      
      const { error } = await supabase
        .from(this.embeddingModelsTable)
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
        .from(this.embeddingModelsTable)
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
}
