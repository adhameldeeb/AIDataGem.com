
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

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
    
    return true;
  } catch (error) {
    console.error('Error creating database schema:', error);
    return false;
  }
}
