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
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

const MAIN_COLOR = "#476C9B";


type ProductOption = {
  product_qr: string;
  current_station: string;
};
type ReworkReason = {
  id: number;
  rework_reason: string;
};

type User = {
  firstName: string;
  lastName: string;
  role: string;
};



export default function ReworkStartPage() {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [reworkOptions, setReworkOptions] = useState<ReworkReason[]>([]);
  const [reasons, setReasons] = useState<ReworkReason[]>([]);
  const [reworkLoading, setReworkLoading] = useState(true);


  const router = useRouter();

  const [selectedProduct, setSelectedProduct] =
    useState<ProductOption | null>(null);

  const [authorizedUsers, setAuthorizedUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  const [location, setLocation] = useState<"line" | "offline">("line");
  const [description, setDescription] = useState("");

  const [user, setUser] = useState<User | null>(null);

  const [formStartedAt] = useState<string>(
    new Date().toISOString()
  );


  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/rework/notbuffer");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Autocomplete load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // load rework reasons
  useEffect(() => {
    const loadReworkReasons = async () => {
      try {
        const res = await fetch("/api/rework/reasons");
        const data: ReworkReason[] = await res.json();

        const hasOther = data.some(r => r.rework_reason === "Diğer");

        const finalData: ReworkReason[] = hasOther
          ? data
          : [
              ...data,
              { id: -1, rework_reason: "Diğer" }, // sanal id
            ];

        setReworkOptions(finalData);
      } catch (err) {
        console.error("Rework reason load error", err);
        setReworkOptions([{ id: -1, rework_reason: "Diğer" }]);
      } finally {
        setReworkLoading(false);
      }
    };

    loadReworkReasons();
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


  /* ================= USERS ================= */
  const handleAddUser = () => {
    if (!currentUser.trim()) return;
    setAuthorizedUsers((prev) => [...prev, currentUser.trim()]);
    setCurrentUser("");
  };

  const handleRemoveUser = (user: string) => {
    setAuthorizedUsers((prev) => prev.filter((u) => u !== user));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
      if (!selectedProduct) return;

      if (!user) {
        alert("Kullanıcı bilgisi yüklenemedi");
        return;
      }

      if (reasons.length === 0) {
        alert("En az bir rework sebebi seçmelisiniz");
        return;
      }
    const completedTime = new Date();
    const startedTime = new Date(formStartedAt);


    const payload = {
      productQr: selectedProduct.product_qr,
      fromStation: selectedProduct.current_station,
      location,
      authorizedUsers,
      reasons: reasons.map(r => r.rework_reason),
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
    };

    try {
      const res = await fetch("/api/rework/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Rework başlatılamadı");
        return;
      }

      alert("Rework başlatıldı");
      router.push("/dashboard"); //  dashboard’a yönlendir
    } catch (error) {
      console.error("REWORK START ERROR:", error);
      alert("Bir hata oluştu. Tekrar deneyin.");
    }
  };


  /* ================= UI ================= */
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
        Rework Başlat
      </Typography>

      {/* AUTOCOMPLETE */}
      <Autocomplete
        loading={loading}
        options={products}
        value={selectedProduct}
        onChange={(_, value) => setSelectedProduct(value)}
        getOptionLabel={(option) =>
          `${option.product_qr} — ${option.current_station}`
        }
        isOptionEqualToValue={(opt, val) =>
          opt.product_qr === val.product_qr
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Batarya QR Kodu"
            margin="normal"
            sx={textFieldStyle}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* Yetkililer */}
      <Box mt={2}>
        <Typography fontWeight="medium" mb={1} sx={{ color: MAIN_COLOR }}>
          Rework Yetkilileri (Ad Soyad)
        </Typography>

        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            placeholder="Beyza Açıkgöz"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            sx={textFieldStyle}
          />
          <Button
            variant="contained"
            sx={primaryButtonStyle}
            onClick={handleAddUser}
          >
            Ekle
          </Button>
        </Box>

        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {authorizedUsers.map((user) => (
            <Chip
              key={user}
              label={user}
              onDelete={() => handleRemoveUser(user)}
              sx={{
                backgroundColor: MAIN_COLOR,
                color: "white",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Lokasyon */}
      <Box mt={3}>
        <Typography fontWeight="medium" mb={1} sx={{ color: MAIN_COLOR }}>
          Rework Yeri
        </Typography>

        <RadioGroup
          row
          value={location}
          onChange={(e) =>
            setLocation(e.target.value as "line" | "offline")
          }
        >
          <FormControlLabel
            value="line"
            sx={{ color: "#395a84" }}
            control={<Radio sx={radioStyle} />}
            label="Hat Üzerinde"
          />
          <FormControlLabel
            value="offline"
            sx={{ color: "#395a84" }}
            control={<Radio sx={radioStyle} />}
            label="Hat Dışında"
          />
        </RadioGroup>
      </Box>

      {/* Sebepler */}
      <Autocomplete
        multiple
        loading={reworkLoading}
        options={reworkOptions}
        value={reasons}
        onChange={(_, value) => setReasons(value)}
        getOptionLabel={(option) => option.rework_reason}
        isOptionEqualToValue={(opt, val) => opt.id === val.id}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.rework_reason}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Rework Sebepleri"
            margin="normal"
            sx={textFieldStyle}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {reworkLoading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />



      {/* Açıklama */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Rework Açıklaması"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        sx={textFieldStyle}
      />

      {/* Submit */}
      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          size="large"
          sx={primaryButtonStyle}
          disabled={
            !selectedProduct ||
            authorizedUsers.length === 0 ||
            reasons.length === 0
          }
          onClick={handleSubmit}
        >
          Rework Başlat
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

const selectStyle = {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: MAIN_COLOR,
  },
};
