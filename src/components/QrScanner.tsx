'use client';
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import QrReader from "./QrReader";
import QrScannerAnimation from "./QrScannerAnimation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const QrScanner: React.FC = () => {
  const [qrValue, setQrValue] = useState("");
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = prefersDarkMode ? "dark" : "light";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"        //  Yatay ortalama
      justifyContent="center"    //  Dikey ortalama
      minHeight="100vh"          //  Sayfanın ortasında konumlandır
      p={4}
      sx={{
        textAlign: "center",
        gap: 4,                  //  Elemanlar arası boşluk
      }}
    >
      {/*  QR animasyonu */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,          //  Reader genişliğiyle hizalı
        }}
      >
        <QrScannerAnimation />
      </Box>

      {/*  QR Reader */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          maxWidth: 400,          //  Animasyonla aynı genişlik
        }}
      >
        <QrReader qrValue={qrValue} onQrChange={setQrValue} />
      </Box>

      {/*  Okunan QR bilgisi */}
      <Box
        mt={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <Typography
          variant="h6"
          sx={{ color: mode === "dark" ? "#F8F7FA" : "#25293C" }}
        >
          Okunan QR:
        </Typography>
        <Typography variant="h6" color="#468C98">
          {qrValue || "Henüz okunmadı"}
        </Typography>
      </Box>
    </Box>
  );
};

export default QrScanner;
