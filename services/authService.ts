import { ClientAuthManager, AuthUser } from '@/lib/auth';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: AuthUser;
    token: string;
  };
  error?: string;
  details?: any[];
}

export interface ApiError {
  success: false;
  error: string;
  status: number;
  details?: any[];
}

/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */
export class AuthService {
  private static readonly BASE_URL = '/api/auth';

  /**
   * Login user with phone and password
   * @param credentials - User login credentials
   * @returns Promise with login response
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Store authentication data
        ClientAuthManager.setAuthData(data.data.token, data.data.user);
      }

      return {
        ...data,
        status: response.status,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        message: 'Login failed',
      };
    }
  }

  /**
   * Register new user
   * @param credentials - User registration credentials
   * @returns Promise with registration response
   */
  static async register(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Store authentication data
        ClientAuthManager.setAuthData(data.data.token, data.data.user);
      }

      return {
        ...data,
        status: response.status,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        message: 'Registration failed',
      };
    }
  }

  /**
   * Logout user and clear session data
   */
  static logout(): void {
    ClientAuthManager.clearAuthData();
    
    // Trigger storage event for cross-tab logout
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns Boolean indicating authentication status
   */
  static isAuthenticated(): boolean {
    return ClientAuthManager.isAuthenticated();
  }

  /**
   * Get current user data
   * @returns Current user or null
   */
  static getCurrentUser(): AuthUser | null {
    return ClientAuthManager.getUser();
  }

  /**
   * Handle API response errors, including 403 unauthorized
   * @param response - Fetch response object
   * @returns Promise that throws on error or returns response
   */
  static async handleApiResponse(response: Response): Promise<Response> {
    if (response.status === 403 || response.status === 401) {
      // Auto logout on authentication errors
      this.logout();
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  }

  /**
   * Make authenticated API request
   * @param url - API endpoint URL
   * @param options - Fetch options
   * @returns Promise with response data
   */
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<any> {
    const token = ClientAuthManager.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    await this.handleApiResponse(response);
    return response.json();
  }
}