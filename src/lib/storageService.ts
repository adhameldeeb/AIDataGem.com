
import { UploadedFile, Message, UploadStats, EmbeddingVisualizationData, STORAGE_KEYS } from './types';

class StorageService {
  // Save files to local storage
  saveFiles(files: UploadedFile[]): void {
    try {
      // We need to convert Date objects to strings before storing
      const serializedFiles = files.map(file => ({
        ...file,
        timestamp: file.timestamp.toISOString()
      }));
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(serializedFiles));
      console.log('Files saved to local storage:', files.length);
    } catch (error) {
      console.error('Error saving files to local storage:', error);
    }
  }

  // Load files from local storage
  loadFiles(): UploadedFile[] {
    try {
      const serializedFiles = localStorage.getItem(STORAGE_KEYS.FILES);
      if (!serializedFiles) return [];
      
      // Convert string dates back to Date objects
      const files = JSON.parse(serializedFiles).map((file: any) => ({
        ...file,
        timestamp: new Date(file.timestamp)
      }));
      
      console.log('Files loaded from local storage:', files.length);
      return files;
    } catch (error) {
      console.error('Error loading files from local storage:', error);
      return [];
    }
  }

  // Save messages to local storage
  saveMessages(messages: Message[]): void {
    try {
      // Convert Date objects to strings
      const serializedMessages = messages.map(message => ({
        ...message,
        timestamp: message.timestamp.toISOString(),
        metadata: message.metadata ? {
          ...message.metadata,
          lastModified: message.metadata.lastModified ? 
            message.metadata.lastModified.toISOString() : undefined
        } : undefined
      }));
      
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(serializedMessages));
      console.log('Messages saved to local storage:', messages.length);
    } catch (error) {
      console.error('Error saving messages to local storage:', error);
    }
  }

  // Load messages from local storage
  loadMessages(): Message[] {
    try {
      const serializedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (!serializedMessages) return [];
      
      // Convert string dates back to Date objects
      const messages = JSON.parse(serializedMessages).map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
        metadata: message.metadata ? {
          ...message.metadata,
          lastModified: message.metadata.lastModified ? 
            new Date(message.metadata.lastModified) : undefined
        } : undefined
      }));
      
      console.log('Messages loaded from local storage:', messages.length);
      return messages;
    } catch (error) {
      console.error('Error loading messages from local storage:', error);
      return [];
    }
  }

  // Save visualization data to local storage
  saveVisualizationData(data: EmbeddingVisualizationData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VISUALIZATION_DATA, JSON.stringify(data));
      console.log('Visualization data saved to local storage:', data.length);
    } catch (error) {
      console.error('Error saving visualization data to local storage:', error);
    }
  }

  // Load visualization data from local storage
  loadVisualizationData(): EmbeddingVisualizationData[] {
    try {
      const serializedData = localStorage.getItem(STORAGE_KEYS.VISUALIZATION_DATA);
      if (!serializedData) return [];
      
      const data = JSON.parse(serializedData);
      console.log('Visualization data loaded from local storage:', data.length);
      return data;
    } catch (error) {
      console.error('Error loading visualization data from local storage:', error);
      return [];
    }
  }

  // Save stats to local storage
  saveStats(stats: UploadStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      console.log('Stats saved to local storage');
    } catch (error) {
      console.error('Error saving stats to local storage:', error);
    }
  }

  // Load stats from local storage
  loadStats(): UploadStats {
    try {
      const serializedStats = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!serializedStats) {
        return {
          totalFiles: 0,
          processedFiles: 0,
          totalMessages: 0,
          processedMessages: 0
        };
      }
      
      const stats = JSON.parse(serializedStats);
      console.log('Stats loaded from local storage');
      return stats;
    } catch (error) {
      console.error('Error loading stats from local storage:', error);
      return {
        totalFiles: 0,
        processedFiles: 0,
        totalMessages: 0,
        processedMessages: 0
      };
    }
  }

  // Clear all data from local storage
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.FILES);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.VISUALIZATION_DATA);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      console.log('All data cleared from local storage');
    } catch (error) {
      console.error('Error clearing data from local storage:', error);
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
