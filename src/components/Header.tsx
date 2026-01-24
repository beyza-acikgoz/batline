'use client';
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  ListItemText,
  Button,
} from "@mui/material";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    role: string;
    rework: boolean;
  } | null>(null);

  const roleLabelMap: Record<string, string> = {
    admin: 'Sistem Yöneticisi (Admin)',
    qualified: 'MES Sistem Yetkilisi (Yetkin)',
    operator: 'Operatör',
    test_engineer: 'Test Mühendisi',
    quality_engineer: 'Kalite Mühendisi',
  };


  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const openProfile = Boolean(anchorEl);

  /* header height */
  useEffect(() => {
    if (headerRef.current) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerRef.current.offsetHeight}px`
      );
    }
  }, []);

  /* COOKIE → /api/me */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) return;

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    loadUser();
  }, []);

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    : "";

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    if (!confirm("Çıkış yapmak istediğinize emin misiniz?")) return;

    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header
      ref={headerRef}
      className="w-full bg-logican-lightGray text-logican-darkBlue shadow-md fixed top-0 left-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center p-4 gap-2 sm:gap-0">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/batline.png"
            alt="BatLine"
            //style={{width:"80px", height:"100px"}}
            width={80}
            height={100}
            className="sm:w-20 sm:h-20 w-16 h-16"
          />
          <Link
            href="/dashboard"
            prefetch={false}
            className="text-lg sm:text-2xl font-bold hover:opacity-90 text-center sm:text-left"
          >
            BatLine - Batarya Paket Üretim Hattı
          </Link>
        </div>

          <Button onClick={() => router.push('/lineview')} variant="text" color="primary">
            Hat İzleme
          </Button>
          <Button onClick={() => router.push('/rework/start')} variant="contained" color="primary">
            Rework Başlat
          </Button>

          <Button onClick={() => router.push('/rework/finish')} variant="outlined" color="primary">    
            Rework Bitir
          </Button>

        {/* Menü + Profil */}
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <Image
            src="/logowrite.png"
            alt="Logican"
            width={250}
            height={250}
            className="inline-block w-32 sm:w-36 h-auto"
          />



          {/* MUI Profil */}
          <Avatar
            onClick={handleMenuOpen}
            sx={{
              width: 45,
              height: 45,
              bgcolor: "#1976d2",
              border: "2px solid #0d47a1",
              cursor: "pointer",
            }}
          >
            {initials}
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={openProfile}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
          <MenuItem>
            <ListItemText
              primary={
                <Typography color="info" fontWeight={600}>
                  {user?.firstName} {user?.lastName}
                </Typography>
              }
              secondary={
                user?.role
                  ? roleLabelMap[user.role] ?? user.role
                  : "-"
              }
            />
          </MenuItem>

            <Divider />

            <MenuItem>
              <Typography color="primary" variant="body1">
                {user?.rework ? "Rework Yetkisi Var" : "Rework Yetkisi Yok"}
              </Typography>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <Typography color="error">Çıkış Yap</Typography>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
