
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { UploadedFile } from '../types';

export class FileStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.FILES);
  }

  async saveFiles(files: UploadedFile[]): Promise<void> {
    try {
      // Format dates for storage
      const formattedFiles = files.map(file => ({
        ...file,
        timestamp: file.timestamp.toISOString()
      }));
      
      await this.upsertData(formattedFiles);
    } catch (error) {
      console.error('Error saving files to Supabase:', error);
    }
  }

  async loadFiles(): Promise<UploadedFile[]> {
    try {
      const data = await this.loadData<any>();
      
      // Transform date strings back to Date objects
      return data.map(file => ({
        ...file,
        timestamp: new Date(file.timestamp)
      }));
    } catch (error) {
      console.error('Error loading files from Supabase:', error);
      return [];
    }
  }
}
