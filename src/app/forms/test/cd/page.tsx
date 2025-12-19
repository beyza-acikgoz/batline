'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Paper, Typography } from '@mui/material';
import FormField from '@/components/FormField';

interface PackLoadFormData {
  govde_temizligi: string;
  sizdirmazlik_verisi: string;
  cikis_konnektor_montaji: string;
  test_sonucu: string;
  dosya: File | null;
  foto: File | null;
}

const PackLoadForm: React.FC = () => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PackLoadFormData>();

  const handleFileChange = (name: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const onSubmit = (data: PackLoadFormData) => {
    const formData = {
      ...data,
      dosya: files.dosya,
      foto: files.foto,
    };
    console.log('PackLoad Data:', formData);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        m: 'auto',
        maxWidth: 700,
        borderRadius: 3,
        bgcolor: '#f9fafb',
      }}
    >
      <Typography variant="h5" mb={3} fontWeight={600}>
        📦 Paket Yükleme İşlemi
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="govde_temizligi"
          label="🧽 Gövde Temizliği"
          type="radio"
          options={['Yapıldı', 'Yapılmadı']}
          register={register}
          error={errors.govde_temizligi}
        />

        <FormField
          name="sizdirmazlik_verisi"
          label="💧 Sızdırmazlık Verisi"
          type="text"
          register={register}
          error={errors.sizdirmazlik_verisi}
          placeholder="Veri giriniz..."
        />

        <FormField
          name="cikis_konnektor_montaji"
          label="🔌 Çıkış Konnektör Montajı"
          type="radio"
          options={['Yapıldı', 'Yapılmadı']}
          register={register}
          error={errors.cikis_konnektor_montaji}
        />

        <FormField
          name="test_sonucu"
          label="⚙️ Test Sonucu"
          type="select"
          options={['Başarılı', 'Başarısız', 'Tekrar Test Gerekli']}
          register={register}
          error={errors.test_sonucu}
        />

        <FormField
          name="dosya"
          label="📁 Test Raporu Dosyası"
          type="file"
          register={register}
          onFileChange={handleFileChange}
        />

        <FormField
          name="foto"
          label="📸 Görsel Yükle"
          type="image"
          register={register}
          onFileChange={handleFileChange}
        />

        <Box textAlign="center" mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ px: 4, py: 1.2, borderRadius: 2 }}
          >
            Kaydet
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PackLoadForm;
