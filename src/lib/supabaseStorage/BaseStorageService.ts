
import { supabase } from '../supabase';

export class BaseStorageService {
  constructor(protected tableName: string) {}

  protected async upsertData<T extends Record<string, any>>(data: T | T[]): Promise<void> {
    try {
      // Convert single item to array for consistent handling
      const dataArray = Array.isArray(data) ? data : [data];
      
      // Use batch processing for multiple items
      if (dataArray.length > 0) {
        // Call the edge function to handle the data upsert
        await supabase.functions.invoke('upsert_data', {
          body: {
            table_name: this.tableName,
            data: dataArray
          }
        });
      }
    } catch (error) {
      console.error(`Error upserting data to ${this.tableName}:`, error);
    }
  }

  protected async loadData<T>(): Promise<T[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch_all_data', {
        body: { table_name: this.tableName }
      });
      
      if (error) throw error;
      
      return data as T[] || [];
    } catch (error) {
      console.error(`Error loading data from ${this.tableName}:`, error);
      return [];
    }
  }

  protected async loadDataWithOrder<T>(orderField: string, ascending: boolean = true): Promise<T[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch_ordered_data', {
        body: {
          table_name: this.tableName,
          order_field: orderField,
          ascending: ascending
        }
      });
      
      if (error) throw error;
      
      return data as T[] || [];
    } catch (error) {
      console.error(`Error loading data from ${this.tableName}:`, error);
      return [];
    }
  }

  protected async deleteAllData(): Promise<void> {
    try {
      await supabase.functions.invoke('delete_all_data', {
        body: { table_name: this.tableName }
      });
    } catch (error) {
      console.error(`Error clearing data from ${this.tableName}:`, error);
    }
  }
}
