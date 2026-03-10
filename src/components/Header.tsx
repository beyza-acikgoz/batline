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
  Button,
  IconButton,
  Drawer,
  Box,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width:900px)");

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

  const menuButtons = (
    <>
      <Button fullWidth variant="contained" onClick={() => router.push('/lineview')} sx={{ backgroundColor: "#ADD9F4" }}>
        Hat İzleme
      </Button>

      <Button fullWidth variant="contained" onClick={() => router.push('/rework/start')} sx={{ backgroundColor: "#468C98" }}>
        Rework Başlat
      </Button>

      <Button fullWidth variant="contained" onClick={() => router.push('/rework/finish')} sx={{ backgroundColor: "#984447" }}>
        Rework Bitir
      </Button>

      <Button fullWidth variant="contained" onClick={() => router.push('/modline')} sx={{ backgroundColor: "#476C9B" }}>
        Modline VI
      </Button>
    </>
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 z-50 w-full shadow-md"
      style={{ backgroundColor: "#DFE0E2", color: "#476C9B" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* SOL */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)}>
              <MenuIcon sx={{ color: "#476C9B" }} />
            </IconButton>
          )}

          <Image src="/batline.png" alt="BatLine" width={60} height={60} />

          <Link href="/dashboard" className="text-lg font-bold" style={{ color: "#476C9B" }}>
            BatLine
          </Link>
        </div>

        {/* DESKTOP BUTONLAR */}
        {!isMobile && (
          <div className="flex gap-2">
            {menuButtons}
          </div>
        )}

        {/* SAĞ */}
        <div className="flex items-center gap-3">
          <Image src="/logowrite.png" alt="Logican" width={120} height={40} />

          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              cursor: "pointer",
              backgroundColor: "#476C9B",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            {initials}
          </Avatar>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            p: 2,
            backgroundColor: "#DFE0E2",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {menuButtons}
        </Box>
      </Drawer>

      {/* PROFİL MENÜ */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            backgroundColor: "#476C9B",
            color: "#ffffff",
            minWidth: 230,
            borderRadius: 3,
            padding: 1,
          },
        }}
      >
        <MenuItem sx={{ flexDirection: "column", alignItems: "flex-start" }}>
          <Typography fontWeight="bold">
            {user?.firstName} {user?.lastName}
          </Typography>

          <Typography fontSize={14}>
            {user?.roleDescription}
          </Typography>

          <Typography
            fontSize={13}
            sx={{
              mt: 0.5,
              px: 1,
              borderRadius: 2,
              backgroundColor: user?.rework ? "#468C98" : "#ADD9F4",
              color: user?.rework ? "#fff" : "#476C9B",
            }}
          >
            {user?.rework ? "Rework Yetkisi Var" : "Rework Yetkisi Yok"}
          </Typography>
        </MenuItem>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.3)", my: 1 }} />

        <MenuItem
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });

            // ClientLayout’a logout olduğunu haber ver
            window.dispatchEvent(new Event("logout"));

            // Login sayfasına yönlendir
            router.push("/login");
          }}
        >
          <Typography sx={{ color: "#ffffff", fontWeight: "bold" }}>
            Çıkış Yap
          </Typography>
        </MenuItem>
      </Menu>
    </header>
  );
};

export default Header;