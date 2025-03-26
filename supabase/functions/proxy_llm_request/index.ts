
// Proxy LLM API requests through Supabase
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/utils.ts";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Add cors headers to response
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
  
  try {
    const { provider, endpoint, body } = await req.json();
    
    if (!provider || !endpoint) {
      throw new Error('Missing required parameters: provider and endpoint');
    }
    
    // Get API key based on provider
    const apiKey = getApiKeyForProvider(provider);
    
    if (!apiKey) {
      throw new Error(`API key not configured for provider: ${provider}`);
    }
    
    // Configure request based on provider
    const requestConfig = getProviderConfig(provider, apiKey, endpoint, body);
    
    // Make the API request
    const response = await fetch(requestConfig.url, {
      method: 'POST',
      headers: requestConfig.headers,
      body: JSON.stringify(requestConfig.body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Provider API error (${response.status}): ${errorText}`);
    }
    
    const responseData = await response.json();
    
    return new Response(
      JSON.stringify(responseData),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error proxying LLM request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers, status: 500 }
    );
  }
});

// Helper function to get API key for provider
function getApiKeyForProvider(provider: string): string | null {
  switch (provider.toLowerCase()) {
    case 'openai':
      return Deno.env.get('OPENAI_API_KEY') || null;
    case 'anthropic':
      return Deno.env.get('ANTHROPIC_API_KEY') || null;
    case 'google':
    case 'gemini':
      return Deno.env.get('GOOGLE_API_KEY') || null;
    case 'perplexity':
      return Deno.env.get('PERPLEXITY_API_KEY') || null;
    case 'grok':
      return Deno.env.get('GROK_API_KEY') || null;
    case 'openrouter':
      return Deno.env.get('OPENROUTER_API_KEY') || null;
    default:
      return null;
  }
}

// Helper function to get provider-specific request configuration
function getProviderConfig(provider: string, apiKey: string, endpoint: string, requestBody: any) {
  switch (provider.toLowerCase()) {
    case 'openai':
      return {
        url: `https://api.openai.com/v1/${endpoint}`,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      };
    case 'anthropic':
      return {
        url: `https://api.anthropic.com/v1/${endpoint}`,
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: requestBody,
      };
    case 'google':
    case 'gemini':
      return {
        url: `https://generativelanguage.googleapis.com/v1/${endpoint}?key=${apiKey}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      };
    case 'perplexity':
      return {
        url: `https://api.perplexity.ai/${endpoint}`,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      };
    case 'openrouter':
      return {
        url: `https://openrouter.ai/api/v1/${endpoint}`,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': Deno.env.get('SUPABASE_URL') || '',
          'X-Title': 'AIDatagem',
        },
        body: requestBody,
      };
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
