
import { supabase } from '../supabase';
import { TABLES } from '../supabase';

export class BaseStorageService {
  constructor(protected tableName: string) {}

  protected async upsertData<T>(data: T[], idField: string = 'id'): Promise<void> {
    try {
      // Instead of using typed methods, use more basic approach
      await Promise.all(data.map(async (item) => {
        // Using raw SQL-like operations via RPC to avoid type errors
        await supabase.rpc('upsert_data', {
          p_table_name: this.tableName,
          p_data: item as any,
          p_id_field: idField
        });
      }));
    } catch (error) {
      console.error(`Error upserting data to ${this.tableName}:`, error);
    }
  }

  protected async loadData<T>(): Promise<T[]> {
    try {
      // Use generic fetch via RPC instead of direct table access
      const { data, error } = await supabase.rpc('fetch_all_data', {
        p_table_name: this.tableName
      });
      
      if (error) throw error;
      
      return (data || []) as T[];
    } catch (error) {
      console.error(`Error loading data from ${this.tableName}:`, error);
      return [];
    }
  }

  protected async loadDataWithOrder<T>(orderField: string, ascending: boolean = true): Promise<T[]> {
    try {
      // Use generic fetch via RPC with ordering
      const { data, error } = await supabase.rpc('fetch_ordered_data', {
        p_table_name: this.tableName,
        p_order_field: orderField,
        p_ascending: ascending
      });
      
      if (error) throw error;
      
      return (data || []) as T[];
    } catch (error) {
      console.error(`Error loading data from ${this.tableName}:`, error);
      return [];
    }
  }

  protected async deleteAllData(): Promise<void> {
    try {
      // Use RPC to delete all data
      await supabase.rpc('delete_all_data', {
        p_table_name: this.tableName
      });
    } catch (error) {
      console.error(`Error clearing data from ${this.tableName}:`, error);
    }
  }
}
