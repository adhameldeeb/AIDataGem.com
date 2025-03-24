
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { Message } from '../types';

export class MessageStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.MESSAGES);
  }

  async saveMessages(messages: Message[]): Promise<void> {
    try {
      // Transform dates to ISO strings for storage
      const formattedMessages = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
        metadata: msg.metadata ? {
          ...msg.metadata,
          lastModified: msg.metadata.lastModified 
            ? msg.metadata.lastModified.toISOString()
            : null
        } : null
      }));
      
      await this.upsertData(formattedMessages);
    } catch (error) {
      console.error('Error saving messages to Supabase:', error);
    }
  }

  async loadMessages(): Promise<Message[]> {
    try {
      const data = await this.loadDataWithOrder<any>('timestamp');
      
      // Transform strings back to Date objects
      return data.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        metadata: msg.metadata ? {
          ...msg.metadata,
          lastModified: msg.metadata.lastModified 
            ? new Date(msg.metadata.lastModified)
            : undefined
        } : undefined
      }));
    } catch (error) {
      console.error('Error loading messages from Supabase:', error);
      return [];
    }
  }
}
