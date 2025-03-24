
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';

export class VisualizationStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.VISUALIZATIONS);
  }

  async saveVisualizationData(data: any[]): Promise<void> {
    try {
      // For visualization data, we'll store each point separately
      const formattedData = data.map(point => ({
        id: point.id || crypto.randomUUID(),
        data: point
      }));
      
      await this.upsertData(formattedData);
    } catch (error) {
      console.error('Error saving visualization data to Supabase:', error);
    }
  }

  async loadVisualizationData(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('data');
      
      if (error) throw error;
      
      return (data || []).map(item => item.data);
    } catch (error) {
      console.error('Error loading visualization data from Supabase:', error);
      return [];
    }
  }
}
