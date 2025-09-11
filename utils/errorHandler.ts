import { AuthService } from '@/services/authService';

export interface ErrorInfo {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ErrorHandlerOptions {
  showNotification?: boolean;
  logError?: boolean;
  redirectOnAuth?: boolean;
}

/**
 * Centralized Error Handler
 * Provides consistent error handling across the application
 */
export class ErrorHandler {
  /**
   * Handle API errors with appropriate user feedback
   * @param error - Error object or message
   * @param options - Error handling options
   * @returns Processed error information
   */
  static handleError(
    error: any, 
    options: ErrorHandlerOptions = {}
  ): ErrorInfo {
    const {
      showNotification = false,
      logError = true,
      redirectOnAuth = true,
    } = options;

    let errorInfo: ErrorInfo = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };

    // Process different error types
    if (error instanceof Error) {
      errorInfo.message = error.message;
      
      // Handle network errors
      if (error.message.includes('fetch')) {
        errorInfo.message = 'Network error. Please check your connection.';
        errorInfo.code = 'NETWORK_ERROR';
      }
    } else if (typeof error === 'string') {
      errorInfo.message = error;
    } else if (error && typeof error === 'object') {
      // Handle API error responses
      if (error.status) {
        errorInfo.status = error.status;
        
        switch (error.status) {
          case 400:
            errorInfo.message = error.error || 'Invalid request data';
            errorInfo.code = 'BAD_REQUEST';
            break;
          case 401:
            errorInfo.message = 'Authentication required';
            errorInfo.code = 'UNAUTHORIZED';
            if (redirectOnAuth) {
              this.handleAuthError();
            }
            break;
          case 403:
            errorInfo.message = 'Access denied';
            errorInfo.code = 'FORBIDDEN';
            if (redirectOnAuth) {
              this.handleAuthError();
            }
            break;
          case 404:
            errorInfo.message = 'Resource not found';
            errorInfo.code = 'NOT_FOUND';
            break;
          case 429:
            errorInfo.message = 'Too many requests. Please try again later.';
            errorInfo.code = 'RATE_LIMITED';
            break;
          case 500:
            errorInfo.message = 'Server error. Please try again later.';
            errorInfo.code = 'SERVER_ERROR';
            break;
          default:
            errorInfo.message = error.error || error.message || 'Request failed';
            errorInfo.code = 'API_ERROR';
        }
      } else {
        errorInfo.message = error.error || error.message || 'Unknown error';
      }
      
      if (error.details) {
        errorInfo.details = error.details;
      }
    }

    // Log error if enabled
    if (logError) {
      console.error('Error handled:', {
        originalError: error,
        processedError: errorInfo,
        timestamp: new Date().toISOString(),
      });
    }

    return errorInfo;
  }

  /**
   * Handle authentication errors
   * Clears session and redirects to login
   */
  private static handleAuthError(): void {
    AuthService.logout();
    
    if (typeof window !== 'undefined') {
      // Show user-friendly message
      const event = new CustomEvent('auth-error', {
        detail: { message: 'Your session has expired. Please login again.' }
      });
      window.dispatchEvent(event);
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    }
  }

  /**
   * Handle validation errors from API
   * @param details - Validation error details
   * @returns Formatted validation errors
   */
  static handleValidationErrors(details: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
    
    if (Array.isArray(details)) {
      details.forEach((detail) => {
        if (detail.path && detail.path[0] && detail.message) {
          errors[detail.path[0]] = detail.message;
        }
      });
    }
    
    return errors;
  }

  /**
   * Create user-friendly error messages
   * @param error - Error information
   * @returns User-friendly error message
   */
  static getUserFriendlyMessage(error: ErrorInfo): string {
    const friendlyMessages: Record<string, string> = {
      NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
      UNAUTHORIZED: 'Please login to access this feature.',
      FORBIDDEN: 'You don\'t have permission to perform this action.',
      NOT_FOUND: 'The requested information could not be found.',
      RATE_LIMITED: 'You\'re making requests too quickly. Please wait a moment and try again.',
      SERVER_ERROR: 'Our servers are experiencing issues. Please try again in a few minutes.',
      BAD_REQUEST: 'Please check your input and try again.',
    };

    return friendlyMessages[error.code || ''] || error.message;
  }

  /**
   * Handle async operations with error handling
   * @param operation - Async operation to execute
   * @param options - Error handling options
   * @returns Promise with result or error
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<{ success: boolean; data?: T; error?: ErrorInfo }> {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      const errorInfo = this.handleError(error, options);
      return { success: false, error: errorInfo };
    }
  }
}

/**
 * Error Boundary Hook
 * React hook for handling errors in components
 */
export const useErrorHandler = () => {
  const handleError = (error: any, options?: ErrorHandlerOptions) => {
    return ErrorHandler.handleError(error, options);
  };

  const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    options?: ErrorHandlerOptions
  ) => {
    return ErrorHandler.withErrorHandling(operation, options);
  };

  return {
    handleError,
    withErrorHandling,
    getUserFriendlyMessage: ErrorHandler.getUserFriendlyMessage,
    handleValidationErrors: ErrorHandler.handleValidationErrors,
  };
};