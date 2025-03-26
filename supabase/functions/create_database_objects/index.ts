
// Edge function to create necessary database objects
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/utils.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Add cors headers to response
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Define the SQL statements for creating the stored procedures
    const sqlStatements = [
      // Create stored procedure for creating a function if it doesn't exist
      `CREATE OR REPLACE FUNCTION create_function_if_not_exists(p_function_name TEXT, p_definition TEXT) 
       RETURNS VOID AS $$
       BEGIN
         IF NOT EXISTS (
           SELECT 1 FROM pg_proc WHERE proname = p_function_name
         ) THEN
           EXECUTE p_definition;
         END IF;
       END;
       $$ LANGUAGE plpgsql;`,
      
      // Create the upsert_data stored procedure
      `CREATE OR REPLACE FUNCTION upsert_data(p_table_name TEXT, p_data JSONB, p_id_field TEXT DEFAULT 'id')
       RETURNS VOID AS $$
       DECLARE
         v_columns TEXT;
         v_values TEXT;
         v_updates TEXT;
         v_sql TEXT;
         v_key TEXT;
         v_value JSONB;
       BEGIN
         -- Initialize empty column and value lists
         v_columns := '';
         v_values := '';
         v_updates := '';
         
         -- Build the column, value, and update lists from the JSON data
         FOR v_key, v_value IN SELECT * FROM jsonb_each(p_data) LOOP
           -- Add column name
           IF v_columns = '' THEN
             v_columns := v_key;
             v_values := 'p_data->>' || quote_literal(v_key);
             v_updates := v_key || ' = p_data->>' || quote_literal(v_key);
           ELSE
             v_columns := v_columns || ', ' || v_key;
             v_values := v_values || ', p_data->>' || quote_literal(v_key);
             v_updates := v_updates || ', ' || v_key || ' = p_data->>' || quote_literal(v_key);
           END IF;
         END LOOP;
         
         -- Construct and execute the SQL statement for upsert
         v_sql := format('
           INSERT INTO %I (%s)
           VALUES (%s)
           ON CONFLICT (%I)
           DO UPDATE SET %s',
           p_table_name, v_columns, v_values, p_id_field, v_updates
         );
         
         EXECUTE v_sql USING p_data;
       END;
       $$ LANGUAGE plpgsql;`,
      
      // Create the fetch_all_data stored procedure
      `CREATE OR REPLACE FUNCTION fetch_all_data(p_table_name TEXT)
       RETURNS SETOF JSONB AS $$
       BEGIN
         RETURN QUERY EXECUTE format('
           SELECT row_to_json(t)::jsonb
           FROM %I AS t',
           p_table_name
         );
       END;
       $$ LANGUAGE plpgsql;`,
      
      // Create the fetch_ordered_data stored procedure
      `CREATE OR REPLACE FUNCTION fetch_ordered_data(p_table_name TEXT, p_order_field TEXT, p_ascending BOOLEAN DEFAULT TRUE)
       RETURNS SETOF JSONB AS $$
       BEGIN
         RETURN QUERY EXECUTE format('
           SELECT row_to_json(t)::jsonb
           FROM %I AS t
           ORDER BY %I %s',
           p_table_name, p_order_field, 
           CASE WHEN p_ascending THEN 'ASC' ELSE 'DESC' END
         );
       END;
       $$ LANGUAGE plpgsql;`,
      
      // Create the delete_all_data stored procedure
      `CREATE OR REPLACE FUNCTION delete_all_data(p_table_name TEXT)
       RETURNS VOID AS $$
       BEGIN
         EXECUTE format('TRUNCATE TABLE %I RESTART IDENTITY', p_table_name);
       END;
       $$ LANGUAGE plpgsql;`,
      
      // Create the get_service_status stored procedure
      `CREATE OR REPLACE FUNCTION get_service_status()
       RETURNS TEXT AS $$
       BEGIN
         RETURN 'online';
       END;
       $$ LANGUAGE plpgsql;`
    ];
    
    // Execute each SQL statement
    for (const sql of sqlStatements) {
      const { error } = await supabase.rpc('create_function_if_not_exists', {
        p_function_name: sql.split(' ')[3], // Extract function name
        p_definition: sql
      });
      
      if (error) throw error;
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Database objects created successfully' }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error creating database objects:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers, status: 500 }
    );
  }
});
