
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { EmbeddingVisualizationData } from '../types';

export class VisualizationStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.VISUALIZATIONS);
  }
  
  async saveVisualizationData(data: EmbeddingVisualizationData[]): Promise<void> {
    try {
      await this.upsertData(data);
    } catch (error) {
      console.error('Error saving visualization data:', error);
    }
  }
  
  async loadVisualizationData(): Promise<EmbeddingVisualizationData[]> {
    try {
      return await this.loadData<EmbeddingVisualizationData>();
    } catch (error) {
      console.error('Error loading visualization data:', error);
      return [];
    }
  }
}
