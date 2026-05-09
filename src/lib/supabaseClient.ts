import { createClient } from '@supabase/supabase-js';
import { getRequiredEnv } from '@/lib/env';
import type { Database } from '@/types/supabase';

const publicUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const publicKey = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(publicUrl, publicKey, {
  auth: {
    persistSession: false,
  },
});

export const supabaseAdmin = createClient<Database>(
  getRequiredEnv('SUPABASE_URL'),
  getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  {
    auth: {
      persistSession: false,
    },
  },
);
