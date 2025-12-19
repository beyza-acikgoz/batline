'use client';
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar } from "@mui/material";

const HeaderAlturunlu: React.FC = () => {
  const [openForms, setOpenForms] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; role: string } | null>(null);

  const formsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dropdown click dışını kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formsRef.current && !formsRef.current.contains(event.target as Node)) setOpenForms(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setOpenProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Token'dan kullanıcı bilgisi al
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
        console.log("User localStorage'dan yüklendi:", parsed);
      } catch (err) {
        console.error("User parse hatası:", err);
      }
    }
  }, []);


  const initials = user ? `${user.firstName[0] || ""}${user.lastName[0] || ""}` : "";

  const handleLogout = async () => {
    if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      try {
        const res = await fetch("/api/logout", { method: "POST" });
        if (res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          alert("Çıkış yapılamadı!");
        }
      } catch (err) {
        console.error(err);
        alert("Bir hata oluştu!");
      }
    }
  };

  return (
    <header className="w-full bg-logican-lightGray text-logican-darkBlue shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center p-4 gap-2 sm:gap-0">
        {/* Logo + Şirket Adı */}
        <div className="flex items-center space-x-2">
          <Image src="/modline.png" alt="ModLine" width={80} height={100} className="sm:w-20 sm:h-20" />
          <Link href="/" className="text-xl sm:text-2xl font-bold hover:opacity-90">
            BatLine - Batarya Paket Üretim Hattı
          </Link>
        </div>

        {/* Menü + Profil */}
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <nav className="flex flex-wrap justify-center space-x-2 sm:space-x-6 sm:space-y-2">
            {/* Altürün Formları */}
            <div className="relative forms" ref={formsRef}>
              <button
                onClick={() => setOpenForms(!openForms)}
                className="focus:outline-none hover:underline text-sm sm:text-base"
                type="button"
              >
                Altürün Hazırlık Formları
              </button>

              {openForms && (
                <div className="absolute right-0 left-0 mt-2 w-70 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <h1 className="block px-4 py-2 text-sm font-bold bg-logican-lightBlue border-b">
                    Altürün Kabulleri
                  </h1>
                  <Link href="/cells" className="block px-4 py-2 text-sm hover:bg-gray-100">Hücreler</Link>
                  <Link href="/modules" className="block px-4 py-2 text-sm hover:bg-gray-100">Modül Gövdesi</Link>
                  <Link href="/sorting" className="block px-4 py-2 text-sm hover:bg-gray-100">Sıkıştırma Levhası</Link>
                </div>
              )}
            </div>

            <Image src="/logowrite.png" alt="Logican" width={150} height={150} className="inline-block" />

            {/* Profil */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="focus:outline-none"
                type="button"
              >
                <Avatar sx={{ width: 35, height: 35, bgcolor: "#1976d2", border: "2px solid #0d47a1" }}>
                  {initials}
                </Avatar>
              </button>

              {openProfile  && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <h1 className="block px-4 py-2 text-sm font-bold hover:bg-gray-100 ">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <label className="block px-4 py-2 text-sm font-bold hover:bg-gray-100 ">
                    {user?.role}
                  </label>
                  <button onClick={handleLogout} className="w-full  px-4 py-2 text-sm bg-logican-lightBlue ">
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderAlturunlu;
