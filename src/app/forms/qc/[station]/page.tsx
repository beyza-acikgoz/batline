'use client';

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Box, Typography, Button } from "@mui/material";
import ApprovalGroup from "@/components/ApprovalGroup";
import checklistsJson from "@/data/checklist.json";

const checklists = checklistsJson as any;

export default function QcFormPage() {
  const { station } = useParams<{ station: string }>();
  const router = useRouter();

  const checklist = checklists[station];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!checklist) {
    return (
      <Typography color="error">
        ❌ Bu istasyon için QC checklist yok
      </Typography>
    );
  }

const onSubmit = async () => {
  try {
    await fetch("/api/station/flag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ station, type: "QC" }),
    });

    setTimeout(() => router.push("/dashboard"), 1000);

  } catch {
    alert("❌ QC kaydedilirken hata oluştu");
  }
};


  return (
    <Box p={4}>
      <Typography
        variant="h6"
        mb={3}
        textAlign="center"
        fontWeight={600}
      >
        {station} – QC Formu
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {checklist.groups.map((group: any, i: number) => (
          <ApprovalGroup
            key={i}
            groupLabel={group.groupLabel}
            items={group.items}
            register={register}
            control={control}
            errors={errors}
          />
        ))}

        <Box textAlign="center" mt={3}>
          <Button type="submit" variant="contained">
            Kaydet
          </Button>
        </Box>
      </form>
    </Box>
  );
}
