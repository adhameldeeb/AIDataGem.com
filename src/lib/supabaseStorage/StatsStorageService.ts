
import { supabase } from '../supabase';
import { UploadStats } from '../types';

export class StatsStorageService {
  private tableName = 'stats';

  async saveStats(stats: UploadStats): Promise<void> {
    try {
      // We'll store stats in a special row with id='current'
      const { error } = await supabase
        .from(this.tableName)
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
        .from(this.tableName)
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
}
