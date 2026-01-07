"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import ApprovalField from "@/components/ApprovalGroup";

export default function QCFormPage() {
  const { station } = useParams<{ station: string }>();
  const router = useRouter();

  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetch(`/api/forms/${station}/qc`)
      .then((res) => res.json())
      .then((data) => {
        console.log("QC SCHEMA:", data);
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

  const onSubmit = async (data: any) => {
    console.log("QC DATA:", data);

    await fetch("/api/station/flag", {
      method: "POST",
      body: JSON.stringify({ station, type: "QC", data }),
    });

    setTimeout(() => router.push("/dashboard"), 800);
  };

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
          marginBottom: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          {station} – QC Kontrol Formu
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
