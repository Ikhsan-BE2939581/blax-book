import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// JWT secret key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Utility function to verify JWT token
 */
function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Protected routes that require authentication
 */
const protectedRoutes = [
  '/user-profile',
  '/admin'
];

/**
 * Public routes that should redirect authenticated users
 */
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/a/login'
];

/**
 * Middleware function to handle route protection
 * @param request - Next.js request object
 * @returns Response or redirect
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or headers for different auth types
  let token: string | undefined;
  let isAuthenticated = false;

  // Check for admin authentication
  if (pathname.startsWith('/admin') || pathname.startsWith('/a/')) {
    token = request.cookies.get('admin_token')?.value;
    if (token) {
      isAuthenticated = verifyToken(token);
    } else {
      // Fallback to localStorage check (client-side)
      // This will be handled by client-side components
      isAuthenticated = false;
    }
  } else {
    // Check for regular user authentication
    token = request.cookies.get('auth_token')?.value || 
            request.headers.get('authorization')?.replace('Bearer ', '');
    if (token) {
      isAuthenticated = verifyToken(token);
    }
  }

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if current path is public (auth pages)
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    let loginUrl: URL;
    
    if (pathname.startsWith('/admin')) {
      loginUrl = new URL('/a/login', request.url);
    } else {
      loginUrl = new URL('/auth/login', request.url);
    }
    
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth pages to appropriate dashboard
  if (isPublicRoute && isAuthenticated) {
    if (pathname.startsWith('/a/login')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specifies which routes should be processed by middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};