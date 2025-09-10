"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { FormField } from "@/components/molecules/FormField/FormField";
import { PageLayout } from "@/components/templates/PageLayout/PageLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo credentials check
      if (
        credentials.username === "admin" &&
        credentials.password === "admin123"
      ) {
        // In a real app, you'd handle authentication properly
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "/admin";
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
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
                Admin Portal
              </h1>
              <p className="text-sky-600 mt-2">Secure access to dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-700">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <User className="absolute left-3 top-10 text-sky-400 w-4 h-4 z-10" />
                <FormField
                  label="Username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="pl-10"
                  placeholder="Enter username"
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
                    setCredentials({ ...credentials, password: e.target.value })
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-sky-200">
              <div className="text-center text-sky-600 text-sm">
                <p className="mb-2 font-medium">Demo Credentials:</p>
                <div className="bg-sky-50 rounded-lg p-3">
                  <p>
                    <strong>Username:</strong> admin
                  </p>
                  <p>
                    <strong>Password:</strong> admin123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
