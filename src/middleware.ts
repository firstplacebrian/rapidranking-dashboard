import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for access token in cookies
  const accessToken = request.cookies.get('access_token')?.value;
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Check if current route is an auth route (login/register)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If route is public, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // If user is not authenticated and trying to access protected route, redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};