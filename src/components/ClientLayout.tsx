'use client';

import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      const data = await res.json();
      setIsLoggedIn(data?.success ?? false);
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleLogout = () => setIsLoggedIn(false);
    window.addEventListener("logout", handleLogout);

    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  return (
    <>
      {isLoggedIn && <Header />}

      <main
        className="flex-1 w-full min-h-screen"
        style={isLoggedIn ? { paddingTop: "var(--header-height)" } : {}}
      >
        {children}
      </main>
    </>
  );
}