'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/molecules/LoadingScreen/LoadingScreen';

/**
 * Enhanced Authentication Manager
 * Handles both regular user and admin authentication
 */
class EnhancedAuthManager {
  /**
   * Check if user is authenticated (regular user)
   */
  static isUserAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Check if admin is authenticated
   */
  static isAdminAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      return isLoggedIn;
    }
    return false;
  }

  /**
   * Get current user data
   */
  static getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('auth_user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Get current admin data
   */
  static getAdmin() {
    if (typeof window !== 'undefined') {
      const adminData = localStorage.getItem('adminUser');
      return adminData ? JSON.parse(adminData) : null;
    }
    return null;
  }

  /**
   * Logout user
   */
  static logoutUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  /**
   * Logout admin
   */
  static logoutAdmin() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUser');
    }
  }
}

/**
 * Higher-Order Component for route protection
 * Wraps components that require authentication
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    redirectTo?: string;
    requireAuth?: boolean;
    adminOnly?: boolean;
  } = {}
) {
  const {
    redirectTo = '/auth/login',
    requireAuth = true,
    adminOnly = false
  } = options;

  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuthentication = () => {
        let authenticated = false;
        
        if (adminOnly) {
          authenticated = EnhancedAuthManager.isAdminAuthenticated();
        } else {
          authenticated = EnhancedAuthManager.isUserAuthenticated();
        }
        
        setIsAuthenticated(authenticated);
        setIsLoading(false);

        // Redirect if authentication requirement is not met
        if (requireAuth && !authenticated) {
          const currentPath = window.location.pathname;
          const loginPath = adminOnly ? '/a/login' : redirectTo;
          const redirectUrl = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
          router.push(redirectUrl);
        } else if (!requireAuth && authenticated) {
          // Redirect authenticated users away from auth pages
          const dashboardPath = adminOnly ? '/admin' : '/';
          router.push(dashboardPath);
        }
      };

      checkAuthentication();

      // Listen for authentication changes
      const handleStorageChange = () => {
        checkAuthentication();
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, [router, requireAuth, adminOnly]);

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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userAuthenticated = EnhancedAuthManager.isUserAuthenticated();
      const adminAuthenticated = EnhancedAuthManager.isAdminAuthenticated();
      const userData = EnhancedAuthManager.getUser();
      const adminData = EnhancedAuthManager.getAdmin();
      
      setIsAuthenticated(userAuthenticated);
      setIsAdminAuthenticated(adminAuthenticated);
      setUser(userData);
      setAdmin(adminData);
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

  const logoutUser = () => {
    EnhancedAuthManager.logoutUser();
    setIsAuthenticated(false);
    setUser(null);
  };

  const logoutAdmin = () => {
    EnhancedAuthManager.logoutAdmin();
    setIsAdminAuthenticated(false);
    setAdmin(null);
  };

  return {
    isAuthenticated,
    isAdminAuthenticated,
    user,
    admin,
    loading,
    logoutUser,
    logoutAdmin
  };
}