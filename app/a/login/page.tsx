"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield, Mail } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { FormField } from "@/components/molecules/FormField/FormField";
import { PageLayout } from "@/components/templates/PageLayout/PageLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin
        ? "/api/auth/admin/login"
        : "/api/auth/admin/register";
      const payload = isLogin
        ? { email: credentials.email, password: credentials.password }
        : {
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminUser", JSON.stringify(result.data.user));

        setSuccess(isLogin ? "Login successful!" : "Registration successful!");
        toast({
          title: "Success",
          description: isLogin
            ? "Welcome back!"
            : "Account created successfully!",
        });

        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        setError(result.error || "Authentication failed");
        toast({
          title: "Error",
          description: result.error || "Authentication failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = "Network error. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
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
            onClick={() => (window.location.href = "/")}
            className="absolute -top-12 left-0 text-sky-700 hover:text-sky-800 hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Main Site
          </Button>

          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-200/50 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                {isLogin ? "Admin Portal" : "Create Admin Account"}
              </h1>
              <p className="text-sky-600 mt-2">
                {isLogin
                  ? "Secure access to dashboard"
                  : "Register for admin access"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-700">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-700">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-10 text-sky-400 w-4 h-4 z-10" />
                  <FormField
                    label="Full Name"
                    type="text"
                    value={credentials.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-10 text-sky-400 w-4 h-4 z-10" />
                <FormField
                  label="Email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-10 text-sky-400 w-4 h-4 z-10" />
                <FormField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="pl-10 pr-10"
                  placeholder="Enter password"
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

              <Button
                type="submit"
                variant="sky"
                className="w-full py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                loading={loading}
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
                {isLogin
                  ? "Don't have an admin account?"
                  : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  setCredentials({ email: "", password: "", name: "" });
                }}
                className="mt-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                {isLogin ? "Create admin account" : "Sign in instead"}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-sky-200">
              <div className="text-center text-sky-600 text-sm">
                {isLogin && (
                  <>
                    <p className="mb-2 font-medium">Demo Credentials:</p>
                    <div className="bg-sky-50 rounded-lg p-3">
                      <p>
                        <strong>Email:</strong> admin@example.com
                      </p>
                      <p>
                        <strong>Password:</strong> admin123
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
