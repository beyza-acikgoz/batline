'use client';
import React from "react";
import { Box, Paper } from "@mui/material";
import { keyframes } from "@emotion/react";
import Image from "next/image";

// Kırmızı tarama çizgisi
const scanAnimation = keyframes`
  0% { top: 0%; }
  100% { top: 100%; }
`;

// Görsel zoom in-out animasyonu
const zoomAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const QrScannerAnimation: React.FC = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        position: "relative",
        width: 250,
        height: 250,
        border: "4px ridge  #476C9B",
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "#DFE0E2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Kırmızı tarama çizgisi */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "red",
          animation: `${scanAnimation} 2s linear infinite alternate`,
          zIndex: 2,
        }}
      />

      {/* Zoom yapan görsel */}
      <Box
        sx={{
          animation: `${zoomAnimation} 3s ease-in-out infinite`,
        }}
      >
        <Image
          src={"/batteryqr.png"}
          alt="QR Code Example"
          width={400}
          height={400}
          style={{ opacity: 0.9 }}
        />
      </Box>
    </Paper>
  );
};

export default QrScannerAnimation;
