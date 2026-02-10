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
  const [user, setUser] = useState<any>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (headerRef.current) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerRef.current.offsetHeight}px`
      );
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch("/api/me", { credentials: "include" });
      const data = await res.json();
      if (data?.success) setUser(data.user);
    };
    loadUser();
  }, []);

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    : "";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 z-50 w-full bg-logican-lightGray text-logican-darkBlue shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3 p-4">

        {/* SOL: LOGO */}
        <div className="flex items-center gap-3 shrink-0">
          <Image
            src="/batline.png"
            alt="BatLine"
            width={80}
            height={80}
            className="w-14 h-14 sm:w-20 sm:h-20"
          />
          <Link
            href="/dashboard"
            className="text-base sm:text-2xl font-bold"
          >
            BatLine
          </Link>
        </div>

        {/* BUTONLAR */}
        <div
          className="
            w-full
            grid grid-cols-2 gap-2
            md:flex md:w-auto md:flex-nowrap md:gap-2
          "
        >
          <Button fullWidth onClick={() => router.push('/lineview')}>
            Hat İzleme
          </Button>
          <Button fullWidth variant="contained" onClick={() => router.push('/rework/start')}>
            Rework Başlat
          </Button>
          <Button fullWidth variant="outlined" onClick={() => router.push('/rework/finish')}>
            Rework Bitir
          </Button>
          <Button fullWidth variant="contained" onClick={() => router.push('/modline')}>
            Modline VI
          </Button>
        </div>

        {/* SAĞ: LOGO + PROFİL */}
        <div className="flex items-center gap-3 shrink-0">
          <Image
            src="/logowrite.png"
            alt="Logican"
            width={200}
            height={80}
            className="w-28 sm:w-36 h-auto"
          />
          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ cursor: "pointer" }}
          >
            {initials}
          </Avatar>
        </div>

        {/* PROFİL MENÜ */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem>
            <ListItemText
              primary={`${user?.firstName} ${user?.lastName}`}
              secondary={user?.role}
            />
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              router.push("/login");
            }}
          >
            <Typography color="error">Çıkış Yap</Typography>
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
   