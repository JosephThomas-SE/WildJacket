import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getRoleFromSession } from '@/lib/roles';
import { hasRole } from '@/lib/permissions';

export async function protectRoute(redirectTo = '/login') {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(redirectTo);
  }

  return { supabase, session };
}

export async function protectRouteWithRole(
  allowedRoles: string[] | string,
  redirectTo = '/unauthorized'
) {
  const result = await protectRoute();

  const role = getRoleFromSession(result.session);

  if (!hasRole(role, allowedRoles)) {
    redirect(redirectTo);
  }

  return result;
}