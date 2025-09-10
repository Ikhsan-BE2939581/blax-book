'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Phone, Lock, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/atoms/Button/Button';
import { FormField } from '@/components/molecules/FormField/FormField';
import { PageLayout } from '@/components/templates/PageLayout/PageLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClientAuthManager } from '@/lib/auth';

/**
 * Authentication API Service
 * Handles API calls for authentication operations
 */
class AuthApiService {
  private static readonly BASE_URL = '/api/auth';

  /**
   * Sends login request to API
   * @param phone - User's phone number
   * @param password - User's password
   * @returns Promise with API response
   */
  static async login(phone: string, password: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
      return { ...data, status: response.status };
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
        status: 500
      };
    }
  }

  /**
   * Sends registration request to API
   * @param phone - User's phone number
   * @param password - User's password
   * @returns Promise with API response
   */
  static async register(phone: string, password: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
      return { ...data, status: response.status };
    } catch (error) {
      console.error('Registration API error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
        status: 500
      };
    }
  }
}

/**
 * Input Validation Service
 * Handles client-side form validation
 */
class ValidationService {
  /**
   * Validates phone number format
   * @param phone - Phone number to validate
   * @returns Validation result with error message if invalid
   */
  static validatePhone(phone: string): { isValid: boolean; error?: string } {
    if (!phone) {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    if (phone.length < 10) {
      return { isValid: false, error: 'Phone number must be at least 10 digits' };
    }
    
    if (phone.length > 15) {
      return { isValid: false, error: 'Phone number must not exceed 15 digits' };
    }
    
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, error: 'Invalid phone number format' };
    }
    
    return { isValid: true };
  }

  /**
   * Validates password strength
   * @param password - Password to validate
   * @returns Validation result with error message if invalid
   */
  static validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    
    if (password.length > 100) {
      return { isValid: false, error: 'Password must not exceed 100 characters' };
    }
    
    return { isValid: true };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    phone?: string;
    password?: string;
  }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (ClientAuthManager.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  /**
   * Validates form inputs
   * @returns Boolean indicating if form is valid
   */
  const validateForm = (): boolean => {
    const errors: { phone?: string; password?: string } = {};
    
    const phoneValidation = ValidationService.validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    }
    
    const passwordValidation = ValidationService.validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles form submission for both login and registration
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const { phone, password } = formData;
      
      let result;
      if (isLogin) {
        result = await AuthApiService.login(phone, password);
      } else {
        result = await AuthApiService.register(phone, password);
      }

      if (result.success) {
        // Store authentication data
        ClientAuthManager.setAuthData(result.data.token, result.data.user);
        
        setSuccess(isLogin ? 'Login successful!' : 'Registration successful!');
        
        // Redirect to home page after short delay
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles input field changes
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <PageLayout
      showHeader={false}
      className="bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200"
    >
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2387CEEB%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative w-full max-w-md">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="absolute -top-12 left-0 text-sky-700 hover:text-sky-800 hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Authentication Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-200/50 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sky-600 mt-2">
                {isLogin ? 'Sign in to your account' : 'Join our football community'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-700">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-700">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Phone Number Field */}
              <div className="relative">
                <Phone className="absolute left-3 top-10 text-sky-400 w-4 h-4 z-10" />
                <FormField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10"
                  placeholder="Enter your phone number"
                  error={validationErrors.phone}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-10 text-sky-400 w-4 h-4 z-10" />
                <FormField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter your password"
                  error={validationErrors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-sky-400 hover:text-sky-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="sky"
                className="w-full py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                loading={loading}
                disabled={loading}
              >
                {loading 
                  ? (isLogin ? 'Signing in...' : 'Creating account...') 
                  : (isLogin ? 'Sign In' : 'Create Account')
                }
              </Button>
            </form>

            {/* Toggle between Login/Register */}
            <div className="mt-6 pt-6 border-t border-sky-200 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setValidationErrors({});
                }}
                className="mt-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                {isLogin ? 'Create new account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}