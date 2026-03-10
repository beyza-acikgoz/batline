"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert
} from "@mui/material";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Alert severity="error">Geçersiz veya eksik link</Alert>
      </Box>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Şifreler uyuşmuyor");
      return;
    }

    const res = await fetch("/api/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Bir hata oluştu");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: 400, backgroundColor:"#ffffff", p: 4, borderRadius: 2 }}>
        <Typography variant="h4" mb={2} color="#000000">
          Şifre Yenile
        </Typography>

        {success ? (
          <Alert severity="success">
            Şifren güncellendi. Giriş sayfasına yönlendiriliyorsun…
          </Alert>
        ) : (
          <>
            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="password"
                label="Yeni Şifre"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <TextField
                fullWidth
                type="password"
                label="Yeni Şifre (Tekrar)"
                margin="normal"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />

              <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
                Şifreyi Güncelle
              </Button>
            </form>
          </>
        )}
      </Box>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
