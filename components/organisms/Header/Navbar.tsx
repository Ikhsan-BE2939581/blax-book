import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Calendar, User, Menu, EyeOff, Lock, Phone } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClientAuthManager } from "@/lib/auth";
import AuthModal from "@/components/molecules/Auth/AuthModal";
import { NotificationContainer } from "@/components/ui/notification";
import { useNotification } from "@/hooks/useNotification";

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  onMenuClick?: () => void;
}

export const Navbar: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  userName,
  onMenuClick,
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { notifications, success, error } = useNotification();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = ClientAuthManager.isAuthenticated();
      const user = ClientAuthManager.getUser();
      setIsAuthenticated(authenticated);
      setCurrentUser(user);
    };

    checkAuth();

    // Listen for storage changes (for cross-tab authentication)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const handleLogin = () => {
    // Redirect to login page instead of inline login
    router.push("/auth/login");
    setShowLogin(false);
  };

  const handleLogout = () => {
    ClientAuthManager.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic text color based on scroll state
  const textColorClass = isScrolled
    ? "text-sky-600 hover:text-sky-700"
    : "text-white hover:text-sky-100";

  const brandTextColorClass = isScrolled
    ? "bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
    : "text-white";
  return (
    <>
      <nav
        className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/20"
            : "bg-white/10 backdrop-blur-sm border border-white/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <button
                  className={`text-xl font-bold transition-colors duration-300 ${brandTextColorClass}`}
                  onClick={() => router.push("/")}
                >
                  FootballBook
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => router.push("/")}
                className={`text-sm font-medium transition-colors duration-300 ${textColorClass}`}
              >
                Home
              </button>
              <button
                onClick={() => router.push("/schedule")}
                className={`text-sm font-medium transition-colors duration-300 ${textColorClass}`}
              >
                Schedule
              </button>
              <button
                onClick={() => router.push("/news")}
                className={`text-sm font-medium transition-colors duration-300 ${textColorClass}`}
              >
                News
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="ring-2 ring-sky-200">
                    <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
                      {currentUser.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                  >
                    {currentUser.name || "User"}
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className={`transition-colors duration-300 ${textColorClass}`}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  variant="sky"
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="md:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      {/* Notification Container */}
      <NotificationContainer 
        notifications={notifications}
        position="top-right"
      />
    </>
  );
};
