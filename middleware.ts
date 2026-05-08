import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withSecurityHeaders } from './src/middleware/secureHeaders';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return withSecurityHeaders(response);
}

export const config = {
  matcher: ['/(.*)'],
};
