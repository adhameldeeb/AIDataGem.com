
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { supabase } from '../supabase';
import { Process } from '../types';

export class ProcessStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.PROCESSES);
  }

  async saveProcess(process: Process): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .upsert({
          id: process.id,
          name: process.name,
          type: process.type,
          status: process.status,
          progress: process.progress,
          start_time: process.startTime.toISOString(),
          end_time: process.endTime ? process.endTime.toISOString() : null,
          error: process.error || null,
          metadata: process.metadata || null,
          result: process.result || null
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving process to Supabase:', error);
    }
  }

  async loadProcesses(): Promise<Process[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        status: item.status,
        progress: item.progress,
        startTime: new Date(item.start_time),
        endTime: item.end_time ? new Date(item.end_time) : undefined,
        error: item.error || undefined,
        metadata: item.metadata,
        result: item.result
      }));
    } catch (error) {
      console.error('Error loading processes from Supabase:', error);
      return [];
    }
  }

  // Adding this method to match the API used in the supabaseStorageService object
  async saveProcesses(processes: Process[]): Promise<void> {
    try {
      for (const process of processes) {
        await this.saveProcess(process);
      }
    } catch (error) {
      console.error('Error saving processes to Supabase:', error);
    }
  }
}
