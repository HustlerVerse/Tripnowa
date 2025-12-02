import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

export function getTokenFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get('token')?.value;
  return token || null;
}

export function getTokenFromClient(): string | null {
  if (typeof window === 'undefined') return null;
  // Client-side token retrieval is handled by cookies in browser
  return null;
}

export function verifyAuth(request: NextRequest): { userId: string; email: string; role: string } | null {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest): { userId: string; email: string; role: string } {
  const auth = verifyAuth(request);
  if (!auth) {
    throw new Error('Unauthorized');
  }
  return auth;
}

export function requireAdmin(request: NextRequest): { userId: string; email: string; role: string } {
  const auth = requireAuth(request);
  if (auth.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return auth;
}

