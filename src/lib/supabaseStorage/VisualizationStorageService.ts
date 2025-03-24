
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { EmbeddingVisualizationData } from '../types';
import { supabase } from '../supabase';

export class VisualizationStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.VISUALIZATIONS);
  }
  
  async saveVisualizationData(data: EmbeddingVisualizationData[]): Promise<void> {
    try {
      await this.upsertData(data);
    } catch (error) {
      console.error('Error saving visualization data to Supabase:', error);
    }
  }
  
  async loadVisualizationData(): Promise<EmbeddingVisualizationData[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.VISUALIZATIONS)
        .select('*');
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error loading visualization data from Supabase:', error);
      return [];
    }
  }
}
