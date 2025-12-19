'use client';
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface QrReaderProps {
  qrValue: string;
  onQrChange: (value: string) => void;
}

const QrReader: React.FC<QrReaderProps> = ({ qrValue, onQrChange }) => {
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ seri?: string; kw?: string } | null>(null);
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = prefersDarkMode ? "dark" : "light";

  //  Beklenen format: G-S103011250052
  const qrRegex = /^([GMBW])-S(\d{4})(\d{4})(\d{4})$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onQrChange(value);

    //  Boşsa sıfırla
    if (!value) {
      setError(null);
      return;
    }

    //  Uzunluk kontrolü
    if (value.length > 15) {
      setError("❌ En fazla 15 karakter girebilirsiniz!");
      return;
    }

    //  Regex kontrolü
    const match = qrRegex.exec(value);
    if (!match) {
      setError("⚠️ QR sistematiğine uymuyor! Format: G-S103011250052");
      return;
    }

    const [_, urunKodu, isEmri, tarih, sira] = match;

    //  Üretimde sadece G tipi izinli
    if (urunKodu !== "G") {
      setError("❌ Şu anda üretim sadece 'G' (Gövde/Kasa) ürün kodu ile yapılabilir!");
      return;
    }

    //  Seri ve kW bilgisi çözümleme
    const seriStr = isEmri.substring(0, 2); // örn: "10"
    const kwStr = isEmri.substring(2, 5);   // örn: "30"
    const seri = Number(seriStr);
    const kw = Number(kwStr);

    //  Seri kontrolü (10–16 arası olmalı)
    if (isNaN(seri) || seri < 10 || seri > 16) {
      setError("⚠️ Geçersiz seri sayısı! Seri sayısı 10 ile 16 arasında olmalıdır.");
      return;
    }

    //  kW kontrolü (30 veya 60 olmalı)
    if (![30, 60].includes(kw)) {
      setError("⚠️ Geçersiz güç değeri! Yalnızca 30 kW veya 60 kW olabilir.");
      return;
    }

    //  Tüm kontroller geçti
    setError(null);
    setDialogInfo({ seri: seriStr, kw: kwStr });
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    alert("✅ Üretim başlatıldı!");
  };

  const handleCancel = () => {
    setDialogOpen(false);
    alert("🚫 Üretim iptal edildi.");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
      p={4}
    >
      <Box textAlign="center" width="100%" maxWidth={400}>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            fontWeight: "500",
            color: mode === "dark" ? "#F8F7FA" : "#25293C",
          }}
        >
          QR Kodunu Tara veya Elle Gir:
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="QR kodu buraya yazın veya okutun"
          value={qrValue}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fff",
            },
          }}
        />

        {/*  Ek hata bildirimi */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Onay Penceresi */}
      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Üretim Onayı</DialogTitle>
        <DialogContent>
          <Typography>
            {dialogInfo && (
              <>
                Bu QR kod, <b>{dialogInfo.seri}</b> serili ve{" "}
                <b>{dialogInfo.kw} kW</b> gücünde batarya üretimi içindir.
                <br />
                Üretime başlanacak, onaylıyor musunuz?
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="error">
            İptal
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QrReader;
