
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { Process } from '../types';

interface ProcessRecord {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  start_time: string;
  end_time?: string | null;
  error?: string | null;
  metadata?: Record<string, any> | null;
  result?: any | null;
}

export class ProcessStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.PROCESSES);
  }

  async saveProcess(process: Process): Promise<void> {
    try {
      const processRecord: ProcessRecord = {
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
      };

      await this.upsertData(processRecord);
    } catch (error) {
      console.error('Error saving process:', error);
    }
  }

  async loadProcesses(): Promise<Process[]> {
    try {
      const processes = await this.loadDataWithOrder<ProcessRecord>('start_time', false);
      
      return processes.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as Process['type'],
        status: item.status as Process['status'],
        progress: item.progress,
        startTime: new Date(item.start_time),
        endTime: item.end_time ? new Date(item.end_time) : undefined,
        error: item.error || undefined,
        metadata: item.metadata,
        result: item.result
      }));
    } catch (error) {
      console.error('Error loading processes:', error);
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
      console.error('Error saving processes:', error);
    }
  }
}
