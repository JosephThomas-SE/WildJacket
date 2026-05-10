import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { getRequiredEnv } from '@/lib/env';
import type { Role } from '@/lib/roles';
import { ADMIN_ROLES, SUPER_ADMIN_ROLES, getRoleFromSession } from '@/lib/roles';
import { requireRole as enforceRole } from '@/lib/permissions';

const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

export function createSupabaseServerClient() {
  return createServerClient<Database>({ cookies });
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

export async function requireRole(allowedRoles: Role | Role[]) {
  const session = await requireUser();
  const role = getRoleFromSession(session);

  enforceRole(role, allowedRoles);

  return session;
}

export async function requireAdmin() {
  await requireRole(ADMIN_ROLES);
}

export async function requireSuperAdmin() {
  await requireRole(SUPER_ADMIN_ROLES);
}
