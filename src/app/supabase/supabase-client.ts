// src/app/supabase/supabase-client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pcwdclaeiiltkarmbpsb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjd2RjbGFlaWlsdGthcm1icHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzExMzksImV4cCI6MjA2MTA0NzEzOX0.YpLvMxJSIW5cuSHZj-ePirsfzZzAQsErmZ-5WNaFyPI';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

