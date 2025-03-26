
// Edge function to initialize necessary database tables
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
    const supabaseClient = getSupabaseClient();
    
    // Create messages table if it doesn't exist
    const { error: messagesError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'messages',
      p_definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        model TEXT,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
        user_id UUID,
        conversation_id UUID,
        embedding VECTOR(1536),
        metadata JSONB
      `
    });
    
    if (messagesError) throw messagesError;
    
    // Create files table if it doesn't exist
    const { error: filesError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'files',
      p_definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        size INTEGER NOT NULL,
        type TEXT,
        status TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        messages_count INTEGER DEFAULT 0,
        error TEXT,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
        user_id UUID
      `
    });
    
    if (filesError) throw filesError;
    
    // Create stats table if it doesn't exist
    const { error: statsError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'stats',
      p_definition: `
        id TEXT PRIMARY KEY,
        total_files INTEGER DEFAULT 0,
        processed_files INTEGER DEFAULT 0,
        total_messages INTEGER DEFAULT 0,
        processed_messages INTEGER DEFAULT 0,
        user_id UUID
      `
    });
    
    if (statsError) throw statsError;
    
    // Create visualizations table if it doesn't exist
    const { error: visualizationsError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'visualizations',
      p_definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        x FLOAT NOT NULL,
        y FLOAT NOT NULL,
        group_name TEXT,
        content TEXT,
        similarity FLOAT,
        user_id UUID
      `
    });
    
    if (visualizationsError) throw visualizationsError;
    
    // Create llm_models table if it doesn't exist
    const { error: modelsError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'llm_models',
      p_definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        api_endpoint TEXT,
        priority INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        type TEXT DEFAULT 'llm',
        context_window INTEGER,
        max_tokens INTEGER,
        cost_per_1k_tokens FLOAT,
        metadata JSONB,
        is_secured BOOLEAN DEFAULT false,
        last_used TIMESTAMPTZ,
        user_id UUID
      `
    });
    
    if (modelsError) throw modelsError;
    
    // Create embedding_models table if it doesn't exist
    const { error: embeddingModelsError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'embedding_models',
      p_definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        dimensions INTEGER NOT NULL,
        api_endpoint TEXT,
        status TEXT DEFAULT 'active',
        is_default BOOLEAN DEFAULT false,
        metadata JSONB,
        is_secured BOOLEAN DEFAULT false,
        last_used TIMESTAMPTZ,
        user_id UUID
      `
    });
    
    if (embeddingModelsError) throw embeddingModelsError;
    
    // Create projects table if it doesn't exist
    const { error: projectsError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'projects',
      p_definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        color TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        message_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        metadata JSONB,
        subjects TEXT[],
        tags TEXT[],
        owner TEXT,
        priority TEXT,
        user_id UUID
      `
    });
    
    if (projectsError) throw projectsError;
    
    // Create secrets table if it doesn't exist
    const { error: secretsError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'secrets',
      p_definition: `
        id TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        user_id UUID
      `
    });
    
    if (secretsError) throw secretsError;
    
    // Create processes table if it doesn't exist
    const { error: processesError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'processes',
      p_definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        start_time TIMESTAMPTZ DEFAULT now(),
        end_time TIMESTAMPTZ,
        error TEXT,
        metadata JSONB,
        result JSONB,
        user_id UUID
      `
    });
    
    if (processesError) throw processesError;
    
    // Create conversations table if it doesn't exist
    const { error: conversationsError } = await supabaseClient.rpc('create_table_if_not_exists', {
      p_table_name: 'conversations',
      p_definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        source TEXT,
        source_id TEXT,
        message_count INTEGER DEFAULT 0,
        model TEXT,
        tags TEXT[],
        category TEXT,
        sentiment FLOAT,
        is_favorite BOOLEAN DEFAULT false,
        summary TEXT,
        user_id UUID
      `
    });
    
    if (conversationsError) throw conversationsError;
    
    // Create custom stored procedure for creating tables if they don't exist
    const { error: createFunctionError } = await supabaseClient.rpc('create_function_if_not_exists', {
      p_function_name: 'create_table_if_not_exists',
      p_definition: `
        CREATE OR REPLACE FUNCTION create_table_if_not_exists(p_table_name TEXT, p_definition TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I (
              %s
            )', p_table_name, p_definition);
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (createFunctionError) throw createFunctionError;
    
    return new Response(
      JSON.stringify({ success: true, message: 'Database tables initialized successfully' }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error initializing database tables:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers, status: 500 }
    );
  }
});

// Helper to get authenticated Supabase client
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
