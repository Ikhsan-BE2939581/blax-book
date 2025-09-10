import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Calendar, User, Menu } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = () => {
    if (phoneNumber.length >= 10) {
      isLoggedIn = true;
      setShowLogin(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                  className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
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
                className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => router.push("/schedule")}
                className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
              >
                Schedule
              </button>
              <button
                onClick={() => router.push("/news")}
                className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors"
              >
                News
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="ring-2 ring-sky-200">
                    <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
                      {userName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">
                    {userName || "User"}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLogin(true)}
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

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login dengan Nomor HP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Nomor HP</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login / Daftar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
