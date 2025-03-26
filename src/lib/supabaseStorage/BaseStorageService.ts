
import { supabase } from '../supabase';

export class BaseStorageService {
  constructor(protected tableName: string) {}

  protected async upsertData<T>(data: T[], idField: string = 'id'): Promise<void> {
    try {
      // Using Edge Function for data operations
      await Promise.all(data.map(async (item) => {
        await supabase.functions.invoke('upsert_data', {
          body: {
            p_table_name: this.tableName,
            p_data: item,
            p_id_field: idField
          }
        });
      }));
    } catch (error) {
      console.error(`Error upserting data to ${this.tableName}:`, error);
    }
  }

  protected async loadData<T>(): Promise<T[]> {
    try {
      // Using Edge Function for data operations
      const { data, error } = await supabase.functions.invoke('fetch_all_data', {
        body: { p_table_name: this.tableName }
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error loading data from ${this.tableName}:`, error);
      return [];
    }
  }

  protected async loadDataWithOrder<T>(orderField: string, ascending: boolean = true): Promise<T[]> {
    try {
      // Using Edge Function for data operations
      const { data, error } = await supabase.functions.invoke('fetch_ordered_data', {
        body: {
          p_table_name: this.tableName,
          p_order_field: orderField,
          p_ascending: ascending
        }
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error loading data from ${this.tableName}:`, error);
      return [];
    }
  }

  protected async deleteAllData(): Promise<void> {
    try {
      // Using Edge Function for data operations
      await supabase.functions.invoke('delete_all_data', {
        body: { p_table_name: this.tableName }
      });
    } catch (error) {
      console.error(`Error clearing data from ${this.tableName}:`, error);
    }
  }
}
