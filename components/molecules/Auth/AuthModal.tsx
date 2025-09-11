import { X } from "lucide-react";
import { useState } from "react";
import { Eye, EyeOff, Phone, Lock, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { FormField } from "@/components/molecules/FormField/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthService, LoginCredentials } from "@/services/authService";
import { useNotification } from "@/hooks/useNotification";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { success, error: showError } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    phone?: string;
    password?: string;
  }>({});

  const resetForm = () => {
    setFormData({
      phone: "",
      password: "",
    });
    setShowPassword(false);
    setError("");
    setValidationErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  /**
   * Validates form inputs
   * @returns Boolean indicating if form is valid
   */
  const validateForm = (): boolean => {
    const errors: { phone?: string; password?: string } = {};
    
    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const credentials: LoginCredentials = {
        phone: formData.phone.trim(),
        password: formData.password,
      };
      
      let result;
      if (isLogin) {
        result = await AuthService.login(credentials);
      } else {
        result = await AuthService.register(credentials);
      }

      if (result.success) {
        // Show success notification
        success(
          isLogin ? 'Login Successful!' : 'Registration Successful!',
          isLogin 
            ? 'Welcome back! You have been successfully logged in.' 
            : 'Your account has been created successfully.',
          4000
        );
        
        // Close modal and reset form
        handleClose();
        
        // Trigger page refresh or navigation if needed
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Handle API errors
        if (result.details && Array.isArray(result.details)) {
          // Handle validation errors from API
          const apiErrors: { phone?: string; password?: string } = {};
          result.details.forEach((detail: any) => {
            if (detail.path && detail.path[0]) {
              apiErrors[detail.path[0] as keyof typeof apiErrors] = detail.message;
            }
          });
          setValidationErrors(apiErrors);
        } else {
          setError(result.error || 'Authentication failed');
          showError(
            isLogin ? 'Login Failed' : 'Registration Failed',
            result.error || 'Please check your credentials and try again.',
            6000
          );
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showError(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection and try again.',
        6000
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles input field changes and clears validation errors
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error
    if (error) {
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sky-600 mt-2">
              {isLogin
                ? "Sign in to your account"
                : "Join our football community"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                type={showPassword ? "text" : "password"}
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
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
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
                setError("");
                setValidationErrors({});
                setFormData({ phone: "", password: "" });
              }}
              className="mt-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
            >
              {isLogin ? "Create new account" : "Sign in instead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}