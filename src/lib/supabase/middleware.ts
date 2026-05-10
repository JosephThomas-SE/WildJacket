import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';
import { getRequiredEnv } from '@/lib/env';
import { getRoleFromSession } from '@/lib/roles';
import { hasRole } from '@/lib/permissions';

const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

export function createServerClient(req: NextRequest, res: NextResponse) {
  return createServerClient<Database>({
    req,
    res,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
}

export async function protectRoute(req: NextRequest, res: NextResponse, redirectTo = '/login') {
  const supabase = createServerClient(req, res);
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return { supabase, session: data.session };
}

export async function protectRouteWithRole(
  req: NextRequest,
  res: NextResponse,
  allowedRoles: string[] | string,
  redirectTo = '/unauthorized',
) {
  const result = await protectRoute(req, res);

  if (result instanceof NextResponse) {
    return result;
  }

  const role = getRoleFromSession(result.session);

  if (!hasRole(role, allowedRoles)) {
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return result;
}
