'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { UseFormRegister, Control } from 'react-hook-form';
import { Box, Typography, Radio, TextField, useMediaQuery, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface ApprovalItem {
  name: string;
  label: string;
  fieldType?: 'radio' | 'text' | 'file' | 'image' | 'date';
  validation?: any;
}


interface ApprovalGroupProps {
  groupLabel: string;
  items: ApprovalItem[];
  register: UseFormRegister<any>;
  control: Control<any>;
  errors?: any;
}

const ApprovalGroup: React.FC<ApprovalGroupProps> = ({
  groupLabel,
  items,
  register,
  errors,
}) => {
  const [values, setValues] = useState<{ [key: string]: any }>({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});


  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ mb: 3, width: '100%', overflowX: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {groupLabel}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {items.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
              p: 2,
              borderRadius: 2,
              bgcolor: '#4a4646ff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              minWidth: 0,
            }}
          >
            <Typography sx={{ fontWeight: 500, mb: 1, wordBreak: 'break-word' }}>
              {item.label}
            </Typography>

            {/* ✅ Radio Field */}
            {item.fieldType === 'radio' && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isSmallScreen ? 'column' : 'row',
                  alignItems: isSmallScreen ? 'flex-start' : 'center',
                  gap: isSmallScreen ? 1 : 3,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Radio
                    {...register(item.name, item.validation || { required: 'Bu alan zorunludur.' })}
                    checked={values[item.name] === 'uygun'}
                    onChange={() => handleChange(item.name, 'uygun')}
                  />
                  <Typography variant="body2">Uygundur</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Radio
                    {...register(item.name, item.validation || { required: 'Bu alan zorunludur.' })}
                    checked={values[item.name] === 'uygunsuz'}
                    onChange={() => handleChange(item.name, 'uygunsuz')}
                  />
                  <Typography variant="body2">Uygun değildir</Typography>
                </Box>
              </Box>
            )}

            {/* ✅ Text Field */}
            {item.fieldType === 'text' && (
              <TextField
                {...register(item.name, item.validation || { required: 'Bu alan zorunludur.' })}
                placeholder="Değer giriniz"
                fullWidth
                value={values[item.name] || ''}
                inputRef={(el) => (inputRefs.current[item.name] = el)}
                onClick={() => inputRefs.current[item.name]?.focus()}
                onFocus={() => inputRefs.current[item.name]?.focus()}
                onChange={(e) => handleChange(item.name, e.target.value)}
              />
            )}


            {/* ✅ Date Field (Controller ile tam entegre) */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
              {item.fieldType === 'date' && (
                <DatePicker
                  label={item.label}
                  format="DD/MM/YYYY" // Gün, Ay, Yıl sırası
                  value={values[item.name] || dayjs()}
                  onChange={(newValue) => handleChange(item.name, newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors[item.name],
                      helperText: errors[item.name]?.message,
                    },
                  }}
                />
              )}
            </LocalizationProvider>


            {/* ✅ File / Image Field */}
            {(item.fieldType === 'file' || item.fieldType === 'image') && (
              <Box sx={{ mt: 1 }}>
                <Button variant="outlined" component="label">
                  Dosya Yükle
                  <input
                    type="file"
                    hidden
                    {...register(item.name)}
                    onChange={(e) =>
                      handleChange(item.name, e.target.files ? e.target.files[0] : null)
                    }
                  />
                </Button>
                {values[item.name] && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Seçilen dosya: {values[item.name].name || 'Dosya seçildi'}
                  </Typography>
                )}
              </Box>
            )}

            {/* ✅ Error Display */}
            {errors?.[item.name] && (
              <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
                {errors[item.name]?.message}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ApprovalGroup;
