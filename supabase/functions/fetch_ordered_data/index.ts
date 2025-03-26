
// Generic function to fetch ordered data from any table
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
    const { p_table_name, p_order_field, p_ascending } = await req.json();
    
    if (!p_table_name || !p_order_field) {
      throw new Error('Missing required parameters');
    }
    
    const { data, error } = await supabase
      .from(p_table_name)
      .select('*')
      .order(p_order_field, { ascending: p_ascending !== false });
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify(data || []),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error fetching ordered data:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers, status: 500 }
    );
  }
});
