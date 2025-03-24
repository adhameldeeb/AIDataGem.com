
import { supabase } from '../supabase';

export class BaseStorageService {
  constructor(protected tableName: string) {}

  protected async upsertData<T>(data: T[], idField: string = 'id'): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .upsert(data, { 
          onConflict: idField,
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error upserting data to ${this.tableName}:`, error);
    }
  }

  protected async loadData<T>(): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error loading data from ${this.tableName}:`, error);
      return [];
    }
  }

  protected async loadDataWithOrder<T>(orderField: string, ascending: boolean = true): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order(orderField, { ascending });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error loading data from ${this.tableName}:`, error);
      return [];
    }
  }

  protected async deleteAllData(): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .neq('id', 'dummy_to_match_nothing'); // Delete all rows
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error clearing data from ${this.tableName}:`, error);
    }
  }
}
