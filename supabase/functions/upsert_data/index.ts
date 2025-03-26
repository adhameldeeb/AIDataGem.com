
// Generic function to upsert data to any table
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
    const { p_table_name, p_data, p_id_field } = await req.json();
    
    if (!p_table_name || !p_data) {
      throw new Error('Missing required parameters');
    }
    
    const { data, error } = await supabase
      .from(p_table_name)
      .upsert(p_data, { 
        onConflict: p_id_field || 'id',
        ignoreDuplicates: false
      });
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error upserting data:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers, status: 500 }
    );
  }
});
