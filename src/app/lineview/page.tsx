"use client";

import {
  Box,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

const MAIN_COLOR = "#476C9B";

// ================= TYPES =================
type StationMoment = {
  station_id: string;
  product_id: boolean;
  fc: boolean | null;
  qc: boolean | null;
  done: boolean | null;
  has_qr: boolean;
  last_update: string;
  qr_text: string | null;
};

// ================= UI HELPERS =================
function StatusChip({ label, value }: { label: string; value: boolean | null }) {
  let color: "default" | "success" | "error" = "default";

  if (value === true) color = "success";
  if (value === false) color = "error";

  return (
    <Chip
      label={label}
      color={color}
      variant={value === null ? "outlined" : "filled"}
      sx={{ minWidth: 72 }}
    />
  );
}

// ================= PAGE =================
export default function LineViewPage() {
  const [stations, setStations] = useState<StationMoment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/lineview");
        const data = await res.json();
        setStations(data);
      } catch (err) {
        console.error("Lineview load error", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <Box mt={8} textAlign="center">
        <CircularProgress sx={{ color: MAIN_COLOR }} />
      </Box>
    );
  }

  return (
    <Box
      maxWidth={1000}
      mx="auto"
      mt={6}
      p={4}
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{ color: MAIN_COLOR }}
      >
        Batline – Line View
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {stations.map((s) => (
          <Box
            key={s.station_id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            {/* Station */}
            <Typography fontWeight="medium" sx={{ color: MAIN_COLOR }}>
              {s.station_id}
            </Typography>

            {/* Status Chips */}
            <Box display="flex" gap={1}>
            {s.has_qr ? (
                <Chip
                  label={`QR: ${s.qr_text ?? "-"}`}
                  sx={{
                    backgroundColor: MAIN_COLOR,
                    color: "white",
                    maxWidth: 220,
                  }}
                />
              ) : (
                <Chip
                  label="QR YOK"
                  sx={{
                    backgroundColor: "#e0e0e0",
                    color: "#555",
                  }}
                />
              )}
              <StatusChip label="Product" value={s.product_id} />
              <StatusChip label="FC" value={s.fc} />
              <StatusChip label="Done" value={s.done} />
              <StatusChip label="QC" value={s.qc} />

            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
