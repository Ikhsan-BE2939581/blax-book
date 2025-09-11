import { LoadingScreen } from "@/components/molecules/LoadingScreen/LoadingScreen";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Football Book",
  description:
    "Football book made simple and trustworthy through community football in Jakarta",
  keywords: [
    "football",
    "minisoccer",
    "community",
    "jakarta",
    "bola",
    "main bola",
    "mabol",
  ],
  authors: [{ name: "DamnSans Team" }],
  openGraph: {
    title: "FootballBook",
    description: "Football Book made simple and trustworthy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen message="Loading application" />}>
            {children}
          </Suspense>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
