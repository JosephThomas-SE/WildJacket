import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';
import { getRequiredEnv } from '@/lib/env';

const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

export function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createMiddlewareSupabaseClient<Database>({
    req,
    res,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
}

export async function protectRoute(req: NextRequest, res: NextResponse, redirectTo = '/login') {
  const supabase = createSupabaseMiddlewareClient(req, res);
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return { supabase, session: data.session };
}

export async function protectRouteWithRole(
  req: NextRequest,
  res: NextResponse,
  allowedRoles: string[],
  redirectTo = '/unauthorized',
) {
  const result = await protectRoute(req, res);

  if (result instanceof NextResponse) {
    return result;
  }

  const role = result.session.user.app_metadata?.role || result.session.user.user_metadata?.role;

  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return result;
}
