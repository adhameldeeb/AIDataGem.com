
// Generic function to fetch all data from any table
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
    const { p_table_name } = await req.json();
    
    if (!p_table_name) {
      throw new Error('Missing table name parameter');
    }
    
    const { data, error } = await supabase
      .from(p_table_name)
      .select('*');
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify(data || []),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers, status: 500 }
    );
  }
});
