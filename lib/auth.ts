import jwt from 'jsonwebtoken';

// JWT secret key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  gamesPlayed: number;
  vouchers: number;
  createdAt: Date;
}

export interface AuthToken {
  userId: string;
  phone: string;
  iat: number;
  exp: number;
}

/**
 * Authentication Utility Class
 * Handles token operations and user session management
 */
export class AuthUtils {
  /**
   * Verifies JWT token and returns decoded payload
   * @param token - JWT token to verify
   * @returns Decoded token payload or null if invalid
   */
  static verifyToken(token: string): AuthToken | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthToken;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Checks if token is expired
   * @param token - JWT token to check
   * @returns Boolean indicating if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as AuthToken;
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Extracts user ID from token
   * @param token - JWT token
   * @returns User ID or null if invalid
   */
  static getUserIdFromToken(token: string): string | null {
    const decoded = this.verifyToken(token);
    return decoded ? decoded.userId : null;
  }
}

/**
 * Client-side Authentication Manager
 * Handles token storage and retrieval in browser
 */
export class ClientAuthManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';

  /**
   * Stores authentication data in localStorage
   * @param token - JWT token
   * @param user - User data
   */
  static setAuthData(token: string, user: AuthUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Retrieves stored authentication token
   * @returns JWT token or null if not found
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Retrieves stored user data
   * @returns User data or null if not found
   */
  static getUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Checks if user is currently authenticated
   * @returns Boolean indicating authentication status
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    return !AuthUtils.isTokenExpired(token);
  }

  /**
   * Clears all authentication data
   */
  static clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Logs out user and redirects to login page
   */
  static logout(): void {
    this.clearAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
}