"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  firstName: string;
  lastName: string;
  role: string;
  rework: boolean;
};

export default function Unauthorized() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data?.success && data.user) {
          setUser(data.user);
          console.log("CLIENT USER:", data.user);
        }
      } catch (err) {
        console.error("User fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-3 text-logican-brickRed">
          Yetkisiz Erişim
        </h2>

        <p className="text-lg text-gray-600 mb-2">
          {loading
            ? "Kullanıcı bilgileri yükleniyor..."
            : user
            ? `${user.firstName} ${user.lastName}, bu sayfaya erişim yetkiniz yok.`
            : "Bu sayfaya erişim yetkiniz yok."}
        </p>

        <p className="text-lg text-gray-500 mb-6">
          Rolünüz:{" "}
          <b>
            {loading
              ? "yükleniyor..."
              : user?.role ?? "bilinmiyor"}
          </b>
        </p>

        <p className="text-lg text-gray-500 mb-6">
          Rework Yetkinliğiniz:{" "}
          <b>
            {loading
              ? "yükleniyor..."
              : user
              ? user.rework
                ? "VAR"
                : "YOK"
              : "bilinmiyor"}
          </b>
        </p>

        <button
          onClick={() => router.back()}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Geri Dön
        </button>
      </div>
    </div>
  );
}
