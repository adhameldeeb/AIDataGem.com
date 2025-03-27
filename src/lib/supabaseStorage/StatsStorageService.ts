
import { UploadStats } from '../types';
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';

interface StatsRecord extends UploadStats {
  id: string;
}

export class StatsStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.STATS);
  }

  async saveStats(stats: UploadStats): Promise<void> {
    try {
      // We'll store stats in a special row with id='current'
      const statsRecord: StatsRecord = {
        id: 'current',
        ...stats
      };
      
      await this.upsertData(statsRecord);
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }

  async loadStats(): Promise<UploadStats> {
    try {
      const stats = await this.loadData<StatsRecord>();
      const currentStats = stats.find(s => s.id === 'current');
      
      if (currentStats) {
        // Remove the id property before returning
        const { id, ...uploadStats } = currentStats;
        return uploadStats;
      }
      
      return {
        totalFiles: 0,
        processedFiles: 0,
        totalMessages: 0,
        processedMessages: 0
      };
    } catch (error) {
      console.error('Error loading stats:', error);
      return {
        totalFiles: 0,
        processedFiles: 0,
        totalMessages: 0,
        processedMessages: 0
      };
    }
  }
}
