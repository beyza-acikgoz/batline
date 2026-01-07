"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isUnauthorizedPage = pathname === "/unauthorized";


  return (
    <>
      {!isLoginPage && !isUnauthorizedPage && <Header />}

      <main
        className={`flex-1 w-full ${
          isLoginPage ? "p-0" : "px-4 sm:px-8 py-4 sm:py-6"
        } overflow-y-auto`}
        style={!isLoginPage ? { paddingTop: "var(--header-height)" } : {}}
      >
        <div className={`flex-1 ${isLoginPage ? "p-0" : "p-8"}`}>
          {children}
        </div>
      </main>
    </>
  );
}
