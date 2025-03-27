
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/utils.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// List of tables to clear
const TABLES = [
  'messages',
  'files',
  'stats',
  'visualizations',
  'llm_models',
  'embedding_models',
  'projects',
  'secrets',
  'processes',
  'conversations'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const results = [];

    // Clear each table
    for (const table of TABLES) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', 'placeholder'); // Delete all rows
        
        if (error) {
          console.error(`Error clearing table ${table}:`, error);
          results.push({ table, success: false, error: error.message });
        } else {
          results.push({ table, success: true });
        }
      } catch (tableError) {
        console.error(`Error clearing table ${table}:`, tableError);
        results.push({ table, success: false, error: tableError.message });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in clear_all_data function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
