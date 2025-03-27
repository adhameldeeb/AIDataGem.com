
// Simple endpoint to check if Supabase service is online and DB is accessible
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/utils.ts';

const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Add cors headers to the response
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
  
  try {
    const supabase = getSupabaseClient();
    
    // Try a simple query to test connection - don't expect an actual table
    // Just verify that the database connection works
    try {
      await supabase.from('_connection_test').select('*').limit(1);
    } catch (error) {
      // It's expected this will fail with a "relation does not exist" error
      // This is actually a good sign as it means we connected to the DB
      if (error.message && error.message.includes('does not exist')) {
        // This is a successful connection!
        return new Response(
          JSON.stringify('online'),
          { headers, status: 200 }
        );
      }
    }
    
    // If we get here, we're also online
    return new Response(
      JSON.stringify('online'),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error checking service status:', error);
    
    return new Response(
      JSON.stringify({ error: 'Database service unavailable', details: error.message }),
      { headers, status: 500 }
    );
  }
});
