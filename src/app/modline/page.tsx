"use client";

import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MAIN_COLOR = "#476C9B";

type User = {
  firstName: string;
  lastName: string;
  role: string;
};

export default function QualityControlForm() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [productCode, setProductCode] = useState("");
  const [station, setStation] = useState("");
  const [controlType, setControlType] =
    useState<"incoming" | "process" | "final">("process");
  const [result, setResult] =
    useState<"ok" | "nok">("ok");
  const [defectDescription, setDefectDescription] = useState("");
  const [description, setDescription] = useState("");

  const [formStartedAt] = useState(new Date().toISOString());

  /* USER LOAD */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (data?.success) setUser(data.user);
      } catch (err) {
        console.error("User load error", err);
      }
    };
    loadUser();
  }, []);

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!productCode || !station || !user) {
      alert("Zorunlu alanları doldurun");
      return;
    }

    const payload = {
      productCode,
      station,
      controlType,
      result,
      defectDescription: result === "nok" ? defectDescription : "",
      description,
      inspector: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      formStartedAt,
      completedAt: new Date().toISOString(),
    };

    console.log("QUALITY CONTROL FORM:", payload);

    alert("Kalite kontrol formu kaydedildi");
    router.push("/dashboard");
  };

  return (
    <Box
      maxWidth={600}
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
        Kalite Kontrol Formu
      </Typography>

      {/* Ürün Kodu */}
      <TextField
        fullWidth
        label="Ürün / Modül Kodu"
        value={productCode}
        onChange={(e) => setProductCode(e.target.value)}
        margin="normal"
        sx={textFieldStyle}
      />

      {/* İstasyon */}
      <TextField
        fullWidth
        label="Kontrol İstasyonu"
        value={station}
        onChange={(e) => setStation(e.target.value)}
        margin="normal"
        sx={textFieldStyle}
      />

      {/* Kontrol Türü */}
      <Box mt={2}>
        <Typography fontWeight="medium" sx={{ color: MAIN_COLOR }}>
          Kontrol Türü
        </Typography>
        <RadioGroup
          row
          value={controlType}
          onChange={(e) =>
            setControlType(e.target.value as any)
          }
        >
          <FormControlLabel
            value="incoming"
            sx={{ color: "#395a84" }}
            control={<Radio sx={radioStyle} />}
            label="Giriş"
          />
          <FormControlLabel
            value="process"
            sx={{ color: "#395a84" }}
            control={<Radio sx={radioStyle} />}
            label="Proses"
          />
          <FormControlLabel
            value="final"
            sx={{ color: "#395a84" }}
            control={<Radio sx={radioStyle} />}
            label="Final"
          />
        </RadioGroup>
      </Box>

      {/* Sonuç */}
      <Box mt={2}>
        <Typography fontWeight="medium" sx={{ color: MAIN_COLOR }}>
          Kontrol Sonucu
        </Typography>
        <RadioGroup
          row
          value={result}
          onChange={(e) =>
            setResult(e.target.value as any)
          }
        >
          <FormControlLabel
            value="ok"
            sx={{ color: "#395a84" }}
            control={<Radio sx={radioStyle} />}
            label="Uygun"
          />
          <FormControlLabel
            value="nok"
            sx={{ color: "#395a84" }}
            control={<Radio sx={radioStyle} />}
            label="Uygun Değil"
          />
        </RadioGroup>
      </Box>

      {/* Hata Açıklaması */}
      {result === "nok" && (
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Hata Açıklaması"
          value={defectDescription}
          onChange={(e) => setDefectDescription(e.target.value)}
          margin="normal"
          sx={textFieldStyle}
        />
      )}

      {/* Genel Açıklama */}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        sx={textFieldStyle}
      />

      {/* Kullanıcı */}
      {user && (
        <Typography mt={2} fontSize={14} color="text.secondary">
          Kontrol Eden: {user.firstName} {user.lastName} ({user.role})
        </Typography>
      )}

      {/* Submit */}
      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          size="large"
          sx={primaryButtonStyle}
          onClick={handleSubmit}
        >
          Kaydet
        </Button>
      </Box>
    </Box>
  );
}

/* ================= STYLES ================= */

const textFieldStyle = {
  "& label.Mui-focused": {
    color: MAIN_COLOR,
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: MAIN_COLOR,
    },
  },
};

const primaryButtonStyle = {
  backgroundColor: MAIN_COLOR,
  "&:hover": {
    backgroundColor: "#395a84",
  },
};

const radioStyle = {
  color: MAIN_COLOR,
  "&.Mui-checked": {
    color: MAIN_COLOR,
  },
};
