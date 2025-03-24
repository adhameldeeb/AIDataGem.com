
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { Process } from '../types';

export class ProcessStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.PROCESSES);
  }

  async saveProcess(process: Process): Promise<void> {
    try {
      const formattedProcess = {
        ...process,
        startTime: process.startTime.toISOString(),
        endTime: process.endTime ? process.endTime.toISOString() : null
      };
      
      await this.upsertData([formattedProcess]);
    } catch (error) {
      console.error('Error saving process to Supabase:', error);
    }
  }

  async loadProcesses(): Promise<Process[]> {
    try {
      const data = await this.loadData<any>();
      
      return data.map(process => ({
        ...process,
        startTime: new Date(process.startTime),
        endTime: process.endTime ? new Date(process.endTime) : undefined
      }));
    } catch (error) {
      console.error('Error loading processes from Supabase:', error);
      return [];
    }
  }
}
