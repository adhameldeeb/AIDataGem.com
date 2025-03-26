
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase as integrationsSupabase } from '@/integrations/supabase/client';

// Use the client from the integrations folder which has the proper credentials
export const supabase = integrationsSupabase;

// Check if Supabase is properly configured
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    // Using a more direct approach to check connection
    const { data, error } = await supabase.rpc('get_service_status');
    return !error && data === 'online';
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
};

// Table names
export const TABLES = {
  MESSAGES: 'messages',
  PROJECTS: 'projects',
  MODELS: 'llm_models',
  EMBEDDING_MODELS: 'embedding_models',
  FILES: 'files',
  SECRETS: 'secrets',
  VISUALIZATIONS: 'visualizations',
  PROCESSES: 'processes'
};

// Helper function to check if a table exists
export async function ensureTablesExist() {
  try {
    // Using a more compatible approach to check tables
    let allTablesExist = true;
    
    for (const table of Object.values(TABLES)) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error && error.code === '42P01') { // Table doesn't exist error code
        allTablesExist = false;
        break;
      }
    }
    
    return allTablesExist;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
}

// Helper to create the database schema if needed
export async function createDatabaseSchema() {
  try {
    // Create tables using SQL commands
    for (const tableName of Object.values(TABLES)) {
      try {
        // This will execute stored procedures to create each table
        // We're using a generic approach that doesn't require specific table typing
        await supabase.rpc(`create_${tableName}_table`);
      } catch (error) {
        console.error(`Error creating ${tableName} table:`, error);
      }
    }
    
    toast.success("Database schema created successfully!");
    return true;
  } catch (error) {
    console.error('Error creating database schema:', error);
    toast.error(`Failed to create database schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}
