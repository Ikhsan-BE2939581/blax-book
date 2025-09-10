'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientAuthManager } from '@/lib/auth';
import { LoadingScreen } from '@/components/molecules/LoadingScreen/LoadingScreen';

/**
 * Higher-Order Component for route protection
 * Wraps components that require authentication
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    redirectTo?: string;
    requireAuth?: boolean;
  } = {}
) {
  const {
    redirectTo = '/auth/login',
    requireAuth = true
  } = options;

  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuthentication = () => {
        const authenticated = ClientAuthManager.isAuthenticated();
        setIsAuthenticated(authenticated);
        setIsLoading(false);

        // Redirect if authentication requirement is not met
        if (requireAuth && !authenticated) {
          const currentPath = window.location.pathname;
          const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
          router.push(redirectUrl);
        } else if (!requireAuth && authenticated) {
          // Redirect authenticated users away from auth pages
          router.push('/');
        }
      };

      checkAuthentication();

      // Listen for authentication changes
      const handleStorageChange = () => {
        checkAuthentication();
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, [router, requireAuth]);

    // Show loading screen while checking authentication
    if (isLoading) {
      return <LoadingScreen message="Checking authentication..." />;
    }

    // Show nothing while redirecting
    if (requireAuth && !isAuthenticated) {
      return <LoadingScreen message="Redirecting to login..." />;
    }

    if (!requireAuth && isAuthenticated) {
      return <LoadingScreen message="Redirecting..." />;
    }

    // Render the wrapped component if authentication check passes
    return <WrappedComponent {...props} />;
  };
}

/**
 * Hook for accessing authentication state in components
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = ClientAuthManager.isAuthenticated();
      const userData = ClientAuthManager.getUser();
      
      setIsAuthenticated(authenticated);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();

    // Listen for authentication changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    ClientAuthManager.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    logout
  };
}