'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import ApprovalGroup, { ApprovalItem } from '@/components/ApprovalGroup';
import checklistsJson from '@/data/checklist.json';

type Checklist = {
  title: string;
  groups: { groupLabel: string; items: ApprovalItem[] }[];
};

// JSON’u tip güvenli hâle getir
const checklists = checklistsJson as unknown as Record<string, Checklist>;

const PackLoadForm: React.FC = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm();
  const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  const userInfo = userStr ? JSON.parse(userStr) : { firstName: 'Unknown', lastName: 'User' };

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      user: `${userInfo.firstName} ${userInfo.lastName}`,
    };
    console.log('PackLoad Data:', formData);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const checklist = checklists["qc"];

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'auto', px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: isMobile ? '100%' : 700,
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          bgcolor: '#f9fafb',
          overflowX: 'auto',
        }}
      >
        <Typography
          variant="h6"
          mb={3}
          fontWeight={600}
          textAlign="center"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          {checklist.title}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {checklist.groups.map((group, index) => (
            <ApprovalGroup
              key={index}
              groupLabel={group.groupLabel}
              items={group.items}
              register={register}
              errors={errors}
              control={control}
            />
          ))}

          <Box textAlign="center" mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.2 },
                borderRadius: 2,
                fontSize: { xs: '0.85rem', sm: '1rem' },
              }}
            >
              Kaydet
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default PackLoadForm;
