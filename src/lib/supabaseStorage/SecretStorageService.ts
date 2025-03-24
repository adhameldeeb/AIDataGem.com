
import { BaseStorageService } from './BaseStorageService';
import { TABLES } from '../supabase';
import { supabase } from '../supabase';

export class SecretStorageService extends BaseStorageService {
  constructor() {
    super(TABLES.SECRETS);
  }

  async saveSecret(key: string, value: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .upsert({ 
          id: key,
          value: value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving secret to Supabase:', error);
    }
  }

  async getSecret(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('value')
        .eq('id', key)
        .single();
      
      if (error) throw error;
      
      return data?.value || null;
    } catch (error) {
      console.error('Error getting secret from Supabase:', error);
      return null;
    }
  }

  async deleteSecret(key: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', key);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting secret from Supabase:', error);
    }
  }

  async listSecrets(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id');
      
      if (error) throw error;
      
      return (data || []).map(item => item.id);
    } catch (error) {
      console.error('Error listing secrets from Supabase:', error);
      return [];
    }
  }

  // Adding these methods to match the API used in the supabaseStorageService object
  async saveSecrets(secrets: { id: string, value: string }[]): Promise<void> {
    try {
      for (const secret of secrets) {
        await this.saveSecret(secret.id, secret.value);
      }
    } catch (error) {
      console.error('Error saving secrets to Supabase:', error);
    }
  }

  async loadSecrets(): Promise<{ id: string, value: string }[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id, value');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error loading secrets from Supabase:', error);
      return [];
    }
  }
}
