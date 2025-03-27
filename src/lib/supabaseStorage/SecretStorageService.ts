
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { supabase } from '../supabase';

interface Secret {
  id: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export class SecretStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.SECRETS);
  }

  async saveSecret(key: string, value: string): Promise<void> {
    try {
      const secretData: Secret = {
        id: key,
        value: value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await this.upsertData(secretData);
    } catch (error) {
      console.error('Error saving secret:', error);
    }
  }

  async getSecret(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get_secret', {
        body: { key }
      });
      
      if (error) throw error;
      
      return data?.value || null;
    } catch (error) {
      console.error('Error getting secret:', error);
      return null;
    }
  }

  async deleteSecret(key: string): Promise<void> {
    try {
      await supabase.functions.invoke('delete_secret', {
        body: { key }
      });
    } catch (error) {
      console.error('Error deleting secret:', error);
    }
  }

  async listSecrets(): Promise<string[]> {
    try {
      const secrets = await this.loadData<Secret>();
      return secrets.map(secret => secret.id);
    } catch (error) {
      console.error('Error listing secrets:', error);
      return [];
    }
  }

  // Adding these methods to match the API used in the supabaseStorageService object
  async saveSecrets(secrets: Secret[]): Promise<void> {
    try {
      await this.upsertData(secrets);
    } catch (error) {
      console.error('Error saving secrets:', error);
    }
  }

  async loadSecrets(): Promise<Secret[]> {
    try {
      return await this.loadData<Secret>();
    } catch (error) {
      console.error('Error loading secrets:', error);
      return [];
    }
  }
}
