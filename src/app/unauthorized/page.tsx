"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data?.success) {
          setRole(data.user.role);
          console.log("CLIENT ROLE:", data.user.role);
        }
      } catch (err) {
        console.error("Role fetch error", err);
      }
    };

    loadRole();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-3 text-logican-brickRed">
          Yetkisiz Erişim
        </h2>

        <p className="text-gray-600 mb-2">
          Bu sayfaya erişim yetkiniz yok.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Rolünüz: <b>{role ?? "yükleniyor..."}</b>
        </p>

        <button
          onClick={() => router.back()}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Geri Dön
        </button>
      </div>
    </div>
  );
}
