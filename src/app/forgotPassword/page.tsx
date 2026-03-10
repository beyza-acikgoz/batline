"use client";

import { useState, FormEvent } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");

    const res = await fetch("/api/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      setError("Bir hata oluştu");
      return;
    }

    setMessage("Eğer bu mail sistemde kayıtlıysa, şifre yenileme linki gönderildi.");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: 400, backgroundColor:"#ffffff", p: 4, borderRadius: 2 }}>
        <Typography variant="h4" mb={2} color="#000000">Şifremi Unuttum</Typography>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle1" mb={2} color="#878787">
            Şifrenizi sıfırlamak için <br></br><b>sistemde kayıtlı e-posta</b> adresinizi girin. <br></br>örn: beyza.acikgoz@karluna.com.tr <br></br>Size bir şifre yenileme linki göndereceğiz.
          </Typography>
          <TextField
            fullWidth
            name="email"
            label="Email"
            margin="normal"
            required
          />
          <Button fullWidth type="submit" variant="contained">
            Şifre Yenileme Linki Gönder
          </Button>
          <Button fullWidth variant="text" sx={{ mt: 1 }} href="/login">
            Anasayfaya Dön
          </Button>

        </form>
      </Box>
    </Box>
  );
}
