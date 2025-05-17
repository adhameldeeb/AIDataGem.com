import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yzbiewcycbzvpverqxpu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Ymlld2N5Y2J6dnB2ZXJxeHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDUyNDcsImV4cCI6MjA2MzA4MTI0N30.ANDmLg2_vXhGX-S-byQj26-trtLu2GW-I6Q317DJNkg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
