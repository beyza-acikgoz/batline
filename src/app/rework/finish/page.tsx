"use client";

import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MAIN_COLOR = "#476C9B";

type ReworkOption = { product_qr: string; rework_target_station: string };

type User = {
  firstName: string;
  lastName: string;
  role: string;
};

export default function ReworkFinishPage() {
  const router = useRouter();
  const [options, setOptions] = useState<ReworkOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ReworkOption | null>(null);

  const [result, setResult] = useState<"success" | "fail">("success");
  const [actions, setActions] = useState("");
  const [changedParts, setChangedParts] = useState<string[]>([]);
  const [currentPart, setCurrentPart] = useState("");
  const [returnStatus, setReturnStatus] = useState<"line" | "buffer" | "scrap">("line");
  const [description, setDescription] = useState("");

  const [user, setUser] = useState<User | null>(null);

  const [formStartedAt] = useState<string>(
    new Date().toISOString()
  );

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await fetch("/api/rework/finish/options");
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, []);

   // user load
 useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (data?.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("User load error", err);
      }
    };

    loadUser();
  }, []);

  const addPart = () => {
    if (!currentPart.trim()) return;
    setChangedParts(prev => [...prev, currentPart.trim()]);
    setCurrentPart("");
  };
  const removePart = (part: string) => setChangedParts(prev => prev.filter(p => p !== part));

  const handleSubmit = async () => {
    if (!selectedProduct) return;

    if (!user) {
      alert("Kullanıcı bilgisi yüklenemedi");
      return;
    }
    
    const completedTime = new Date();
    const startedTime = new Date(formStartedAt);

    const payload = {
      productQr: selectedProduct.product_qr,
      result,
      actions,
      changedParts,
      returnStatus,
      description,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      formStartedAt,
      completedTime: completedTime.toISOString(),
      formDurationSeconds: Math.floor(
        (completedTime.getTime() - startedTime.getTime()) / 1000),
      finishedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/rework/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Rework bitirilemedi");
        return;
      }

      alert("Rework başarıyla tamamlandı");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu, tekrar deneyin");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={6} p={4} sx={{ backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: MAIN_COLOR }}>
        Rework Bitir
      </Typography>

      {/* QR Autocomplete */}
      <Autocomplete
        loading={loading}
        options={options}
        value={selectedProduct}
        onChange={(_, value) => setSelectedProduct(value)}
        getOptionLabel={opt => `${opt.product_qr} — ${opt.rework_target_station}`}
        isOptionEqualToValue={(opt, val) => opt.product_qr === val.product_qr}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Rework QR Seçin"
            margin="normal"
            sx={textFieldStyle}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* Sonuç */}
      <Box mt={3}>
        <Typography fontWeight="medium" mb={1} sx={{ color: MAIN_COLOR }}>Rework Sonucu</Typography>
        <RadioGroup row value={result} onChange={e => setResult(e.target.value as "success" | "fail")}>
          <FormControlLabel value="success" sx={{ color: "#395a84" }} control={<Radio sx={radioStyle} />} label="Başarılı" />
          <FormControlLabel value="fail" sx={{ color: "#395a84" }} control={<Radio sx={radioStyle} />} label="Başarısız" />
        </RadioGroup>
      </Box>

      {/* Yapılan İşlemler */}
      <TextField fullWidth multiline rows={3} label="Yapılan İşlemler" value={actions} onChange={e => setActions(e.target.value)} margin="normal" sx={textFieldStyle} />

      {/* Değişen Parçalar */}
      <Box mt={2}>
        <Typography fontWeight="medium" mb={1} sx={{ color: MAIN_COLOR }}>Değişen Parçalar</Typography>
        <Box display="flex" gap={1}>
          <TextField fullWidth label="Parça Adı" value={currentPart} onChange={e => setCurrentPart(e.target.value)} sx={textFieldStyle} />
          <Button variant="contained" sx={primaryButtonStyle} onClick={addPart}>Ekle</Button>
        </Box>
        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {changedParts.map(part => (
            <Chip key={part} label={part} onDelete={() => removePart(part)} sx={{ backgroundColor: MAIN_COLOR, color: "white" }} />
          ))}
        </Box>
      </Box>

      {/* Hatta Dönüş */}
      <Box mt={3}>
        <Typography fontWeight="medium" mb={1} sx={{ color: MAIN_COLOR }}>Rework Sonrası Durum</Typography>
        <RadioGroup value={returnStatus} onChange={e => setReturnStatus(e.target.value as "line" | "buffer" | "scrap")}>
          <FormControlLabel value="line" sx={{ color: "#395a84" }} control={<Radio sx={radioStyle} />} label="Hatta Geri Döndü" />
          <FormControlLabel value="buffer" sx={{ color: "#395a84" }} control={<Radio sx={radioStyle} />} label="Buffer’a Alındı" />
          <FormControlLabel value="scrap" sx={{ color: "#395a84" }} control={<Radio sx={radioStyle} />} label="Hurda" />
        </RadioGroup>
      </Box>

      {/* Açıklama */}
      <TextField fullWidth multiline rows={3} label="Açıklama" value={description} onChange={e => setDescription(e.target.value)} margin="normal" sx={textFieldStyle} />

      {/* Submit */}
      <Box mt={4} textAlign="right">
        <Button variant="contained" size="large" sx={primaryButtonStyle} disabled={!selectedProduct} onClick={handleSubmit}>
          Rework Bitir
        </Button>
      </Box>
    </Box>
  );
}
/* STYLES */
const textFieldStyle = { "& label.Mui-focused": { color: MAIN_COLOR }, "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: MAIN_COLOR } } };
const primaryButtonStyle = { backgroundColor: MAIN_COLOR, "&:hover": { backgroundColor: "#395a84" } };
const radioStyle = { color: MAIN_COLOR, "&.Mui-checked": { color: MAIN_COLOR } };
