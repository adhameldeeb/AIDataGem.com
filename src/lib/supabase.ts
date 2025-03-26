
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase as integrationsSupabase } from '@/integrations/supabase/client';

// Use the client from the integrations folder which has the proper credentials
export const supabase = integrationsSupabase;

// Check if Supabase is properly configured
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('_metadata').select('*').limit(1);
    return !error;
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
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) throw error;
    
    const existingTables = tables.map(t => t.table_name);
    return Object.values(TABLES).every(table => existingTables.includes(table));
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
}

// Helper to create the database schema if needed
export async function createDatabaseSchema() {
  try {
    // Create messages table
    await supabase.rpc('create_messages_table', {});
    
    // Create projects table
    await supabase.rpc('create_projects_table', {});
    
    // Create models table
    await supabase.rpc('create_models_table', {});
    
    // Create embedding models table
    await supabase.rpc('create_embedding_models_table', {});
    
    // Create files table
    await supabase.rpc('create_files_table', {});
    
    // Create secrets table
    await supabase.rpc('create_secrets_table', {});
    
    // Create visualizations table
    await supabase.rpc('create_visualizations_table', {});
    
    // Create processes table
    await supabase.rpc('create_processes_table', {});
    
    toast.success("Database schema created successfully!");
    return true;
  } catch (error) {
    console.error('Error creating database schema:', error);
    toast.error(`Failed to create database schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}
