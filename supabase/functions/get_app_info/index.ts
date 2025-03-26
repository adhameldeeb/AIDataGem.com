
// Endpoint to get basic application information
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
    // Return basic app info
    const appInfo = {
      name: 'AIDatagem',
      version: '1.0.0',
      description: 'AI-powered data management platform'
    };
    
    return new Response(
      JSON.stringify(appInfo),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error getting app info:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve app information' }),
      { headers, status: 500 }
    );
  }
});
