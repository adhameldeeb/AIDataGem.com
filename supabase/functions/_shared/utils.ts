
// Generic database helper functions for the EdgeFunctions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Setup Supabase client (for edge functions)
export function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Helper to check if tables exist
export async function checkTableExists(tableName: string) {
  const supabase = getSupabaseClient();
  
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      return false; // Table doesn't exist
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// CORS headers helper for API responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
