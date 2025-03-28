
// Simple endpoint to check if Supabase service is online and DB is accessible
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, getSupabaseClient } from '../_shared/utils.ts';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Add cors headers to the response
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
  
  try {
    const supabase = getSupabaseClient();
    
    // Simple query to check if DB is accessible
    const { data, error } = await supabase
      .from('_metadata') // This is a system table that should always exist
      .select('*')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify('online'),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error checking service status:', error);
    
    return new Response(
      JSON.stringify({ error: 'Database service unavailable' }),
      { headers, status: 500 }
    );
  }
});
