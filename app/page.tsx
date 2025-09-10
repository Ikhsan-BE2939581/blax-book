"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/templates/PageLayout/PageLayout";
import Hero from "@/components/Hero";
import MainContent from "@/components/Main";
import Stats from "@/components/Stats";
import { Footer } from "@/components/organisms/Footer/Footer";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    // This is a simple check - in production, use proper JWT/session validation
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
      if (isLoggedIn) {
        setIsLoggedIn(true);
      }
    };

    checkAuth();
  }, []);

  return (
    <PageLayout
      headerProps={{
        isLoggedIn,
        userName: isLoggedIn ? "User" : undefined,
      }}
    >
      <Hero />
      <Stats />
      <MainContent />
      <Footer />
    </PageLayout>
  );
}
