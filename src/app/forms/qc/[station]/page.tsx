// app/forms/qc/[station]/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import ApprovalField from "@/components/ApprovalGroup";

/* ================= TYPES ================= */
type User = {
  firstName: string;
  lastName: string;
  role: string;
  rework: boolean;
};

export default function QcFormPage() {
  const { station } = useParams<{ station: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productQr = searchParams.get("qr");

  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const [formStartedAt] = useState<string>(
    new Date().toISOString()
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ================= LOAD USER ================= */
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

  /* ================= LOAD FORM SCHEMA ================= */
  useEffect(() => {
    fetch(`/api/forms/${station}/qc`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "");
        setSchema(data.schema);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [station]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f6fa",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* ================= QR REQUIRED ================= */
  if (!productQr) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error">
          ❌ Ürün QR bilgisi bulunamadı
        </Typography>
      </Box>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!schema) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f6fa",
        }}
      >
        <Typography color="error" fontWeight={500}>
          ❌ QC formu bulunamadı
        </Typography>
      </Box>
    );
  }

  /* ================= SUBMIT ================= */
  const onSubmit = async (formData: any) => {
    if (!user) {
      alert("Kullanıcı bilgisi yüklenemedi");
      return;
    }

    // schema'dan file alanları bul
    const fileFields = schema.fields.filter(
      (f: any) => f.type === "file"
    );

    const qualityCheckedData = { ...formData };

        // Her file alanı için upload yap
    for (const field of fileFields) {
      const value = formData[field.name];

      if (value instanceof File) {
        const fd = new FormData();
        fd.append("file", value);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const uploadResult = await uploadRes.json();

        //  File yerine URL yaz
        qualityCheckedData[field.name] = {
          name: value.name,
          url: uploadResult.url,
          type: value.type,
          size: value.size,
        };
      }
    }

    const completedTime = new Date();
    const startedTime = new Date(formStartedAt);

    const durationSeconds = Math.floor(
      (completedTime.getTime() - startedTime.getTime()) / 1000
    );

    const payload = {
      productQr,
      station,
      formType: "QC",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      formStartedAt,
      completedTime: completedTime.toISOString(),
      formDurationSeconds: durationSeconds,
      formData: qualityCheckedData,
    };

    await fetch("/api/station/flag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productQr,
        station,
        type: "QC",
        data: payload,
      }),
    });

    router.push("/dashboard");
  };


  /* ================= UI ================= */
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f6fa",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 760,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          marginTop: 4,
          marginBottom: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            textAlign: "center",
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          {station} – QC Kontrol Formu
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 2, textAlign: "center", color: "text.secondary" }}
        >
          Ürün QR: <b>{productQr}</b>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 3,
            textAlign: "left",
            fontWeight: 100,
            color: "primary.main",
          }}
        >
          {title}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {schema.fields.map((field: any) => (
            <ApprovalField
              key={field.name}
              field={field}
              register={register}
              control={control}
              errors={errors}
            />
          ))}

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Kaydet
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
