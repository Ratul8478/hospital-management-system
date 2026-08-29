import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRateLimiter, apiRateLimiter } from '@/lib/rate-limiter';

/**
 * ============================================================================
 * MEDIX ENTERPRISE SECURITY FIREWALL (NEXT.JS EDGE MIDDLEWARE)
 * Enforces HTTP Hardening, Rate Limiting, & Attack Pattern Neutralization
 * ============================================================================
 */

// Malicious scanning path keywords to instantly block
const BLOCKED_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.aws/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/phpmyadmin/i,
  /\/xmlrpc\.php/i,
  /\/\.\./,           // Path traversal
  /\0/,               // Null byte injection
  /\/etc\/passwd/i,
  /\/proc\/self/i,
  /\/actuator/i,
];

// Content Security Policy Definition
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "connect-src 'self' https: wss:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1';

  // 1. INSTANT BLOCK FOR KNOWN EXPLOIT & PROBING PATHS
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Forbidden: Request blocked by security firewall.',
          code: 'SECURITY_BLOCKED_PATH',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }
  }

  // 2. RATE LIMITING FOR API ROUTES
  if (pathname.startsWith('/api/')) {
    const isAuthRoute = pathname.startsWith('/api/v1/auth/') || pathname.startsWith('/api/auth/');
    const limiter = isAuthRoute ? authRateLimiter : apiRateLimiter;
    const rateLimit = limiter.check(ip);

    if (!rateLimit.success) {
      const retryAfterSeconds = Math.ceil(rateLimit.resetTimeMs / 1000);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too Many Requests. Rate limit exceeded to protect system security.',
          retryAfter: `${retryAfterSeconds}s`,
          code: 'RATE_LIMIT_EXCEEDED',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfterSeconds),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + retryAfterSeconds),
          },
        }
      );
    }
  }

  // 3. ATTACH HIGH-GRADE HTTP SECURITY HEADERS
  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy', CSP_HEADER);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and favicon:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static image/video assets (.mp4, .png, .jpg, .svg, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)',
  ],
};
