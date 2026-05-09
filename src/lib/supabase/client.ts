import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { getRequiredEnv } from '@/lib/env';

const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const supabaseBrowser = createBrowserSupabaseClient<Database>({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
});
