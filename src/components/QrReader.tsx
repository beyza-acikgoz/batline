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
import { useRouter } from "next/navigation";

interface QrReaderProps {
  qrValue: string;
  onQrChange: (value: string) => void;
}

const QrReader: React.FC<QrReaderProps> = ({ qrValue, onQrChange }) => {
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] =
    useState<{ seri?: string; kw?: string } | null>(null);

  const router = useRouter();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = prefersDarkMode ? "dark" : "light";

  // QR format
  const qrRegex = /^([GMBW])\*S(\d{4})(\d{4})(\d{4})$/;


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onQrChange(value);

    if (!value) {
      setError(null);
      return;
    }

    if (value.length > 15) {
      setError("❌ En fazla 15 karakter girebilirsiniz!");
      return;
    }

    const match = qrRegex.exec(value);
    if (!match) {
      setError("⚠️ QR sistematiğine uymuyor!");
      return;
    }

    const [_, urunKodu, isEmri] = match;

    if (urunKodu !== "G") {
      setError("❌ Sadece G tipi üretime izinli!");
      return;
    }

    const seriStr = isEmri.substring(0, 2);
    const kwStr = isEmri.substring(2, 5);

    setError(null);

    //  BACKEND’E SOR
    const res = await fetch("/api/qr/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr: value }),
    });

    const data = await res.json();

    switch (data.action) {
      case "CONFIRM_NEW":
        setDialogInfo({ seri: seriStr, kw: kwStr });
        setDialogOpen(true);
        break;

      case "OPEN_FC":
        router.push(
          `/forms/fc/${data.station}?qr=${encodeURIComponent(value)}`
        );
        break;

      case "OPEN_QC":
        router.push(
          `/forms/qc/${data.station}?qr=${encodeURIComponent(value)}`
        );
        break;

      case "WARNING":
        setError(data.message);
        break;
    }
  };

const handleConfirm = async () => {
  setDialogOpen(false);

  const res = await fetch("/api/qr/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      qr: qrValue,
      product_id: true, // üretim onayı ile birlikte id true gönderiliyor
    }),
  });

  const data = await res.json();

  if (data.action === "OPEN_FC") {
    router.push(`/forms/fc/${data.station}`);
  }
};


  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={4} p={4}>
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

        {error && <Alert severity="error">{error}</Alert>}
      </Box>

      <Dialog open={dialogOpen}>
        <DialogTitle>Üretim Onayı</DialogTitle>
        <DialogContent>
          {dialogInfo && (
            <Typography>
              {dialogInfo.seri} seri – {dialogInfo.kw} kW üretim başlatılsın mı?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="error">
            İptal
          </Button>
          <Button onClick={handleConfirm} variant="contained">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QrReader;
