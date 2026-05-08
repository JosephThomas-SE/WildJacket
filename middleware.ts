import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withSecurityHeaders } from './src/middleware/secureHeaders';
import { protectRouteWithRole, protectRoute } from './src/lib/supabase/middleware';

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password', '/'];
const STATIC_ASSETS = ['/_next', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (STATIC_ASSETS.some((path) => pathname.startsWith(path)) || pathname.match(/\.[^/]+$/)) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const result = await protectRouteWithRole(request, NextResponse.next(), ['admin'], '/login');
    if (result instanceof NextResponse) {
      return result;
    }
    return withSecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith('/dashboard')) {
    const result = await protectRoute(request, NextResponse.next(), '/login');
    if (result instanceof NextResponse) {
      return result;
    }
    return withSecurityHeaders(NextResponse.next());
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup', '/forgot-password', '/reset-password'],
};
