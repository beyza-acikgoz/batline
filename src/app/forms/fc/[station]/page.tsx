'use client';
import React from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Box, Typography, Button } from "@mui/material";
import ApprovalGroup from "@/components/ApprovalGroup";
import checklistsJson from "@/data/fc.json";
import { useRouter } from "next/navigation";


const checklists = checklistsJson as any;

export default function FcFormPage() {
  const { station } = useParams();
  const checklist = checklists[station as string];
const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!checklist) {
    return <Typography>❌ Bu istasyon için FC checklist yok</Typography>;
  }

const onSubmit = async (data: any) => {
  console.log("FC FORM DATA:", data);

  const res = await fetch("/api/station/flag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      station,
      type: "FC",
    }),
  });

  if (!res.ok) {
    alert("❌ FC kaydedilirken hata oluştu");
    return;
  }

  alert("✅ FC formu başarıyla kaydedildi");

  // ⏳ 1 saniye sonra dashboard
  setTimeout(() => {
    router.push("/dashboard");
  }, 1000);
};



  return (
    <Box p={4}>
      <Typography variant="h6" mb={3} textAlign="center" bgcolor="GrayText">
        {station} – FC Formu
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
