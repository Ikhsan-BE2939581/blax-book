import React from "react";
import { Navbar } from "@/components/organisms/Header/Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  headerProps?: {
    isLoggedIn?: boolean;
    userName?: string;
    onMenuClick?: () => void;
  };
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  loading = false,
  loadingMessage,
  headerProps,
  className = "",
}) => {
  return (
    <div
      className={`relative bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 ${className}`}
    >
      {showHeader && <Navbar {...headerProps} />}
      <main className="flex-1">{children}</main>
    </div>
  );
};
