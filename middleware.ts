import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    const auth = verifyAuth(request);
    
    if (!auth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (auth.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

