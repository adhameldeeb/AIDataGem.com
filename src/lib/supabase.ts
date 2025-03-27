
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase as integrationsSupabase } from '@/integrations/supabase/client';

// Use the client from the integrations folder which has the proper credentials
export const supabase = integrationsSupabase;

// Check if Supabase is properly configured
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    // Using RPC to check connection
    const { data, error } = await supabase.functions.invoke('get_service_status');
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
  MODELS: 'models',
  EMBEDDING_MODELS: 'embedding_models',
  FILES: 'files',
  SECRETS: 'secrets',
  VISUALIZATIONS: 'visualizations',
  PROCESSES: 'processes',
  CONVERSATIONS: 'conversations',
  STATS: 'stats'  // Added the missing STATS property
};

// Helper function to check if tables exist
export async function ensureTablesExist() {
  try {
    const { data, error } = await supabase.functions.invoke('initialize_tables');
    
    if (error) {
      console.error('Error checking/creating tables:', error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
}

// Helper to create the database schema if needed
export async function createDatabaseSchema() {
  try {
    // Create database objects using Edge Functions
    const { data, error } = await supabase.functions.invoke('create_database_objects');
    
    if (error) throw error;
    
    // Create tables if they don't exist
    const tablesResult = await ensureTablesExist();
    
    if (!tablesResult) throw new Error('Failed to create tables');
    
    toast.success("Database schema created successfully!");
    return true;
  } catch (error) {
    console.error('Error creating database schema:', error);
    toast.error(`Failed to create database schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}
