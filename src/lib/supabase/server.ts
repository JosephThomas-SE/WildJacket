import { createClient } from '@supabase/supabase-js';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { getRequiredEnv } from '@/lib/env';

const supabaseUrl = getRequiredEnv('SUPABASE_URL');
const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

export function createSupabaseServerClient() {
  return createServerComponentClient<Database>({ cookies });
}

export async function getSession() {
  return createSupabaseServerClient().auth.getSession();
}

export async function requireUser() {
  const { data } = await getSession();

  if (!data.session) {
    throw new Error('Authentication required');
  }

  return data.session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireUser();
  const role = session.user.app_metadata?.role || session.user.user_metadata?.role;

  if (!role || (Array.isArray(allowedRoles) ? !allowedRoles.includes(role) : role !== allowedRoles[0])) {
    throw new Error('Insufficient permissions');
  }

  return session;
}
