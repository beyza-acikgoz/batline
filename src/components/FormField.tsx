'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import { UseFormRegister, FieldError } from 'react-hook-form';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface FormFieldProps {
  name: string;
  label: string;
  type: 'text' | 'radio' | 'select' | 'file' | 'image' | 'approval';
  register: UseFormRegister<any>;
  error?: FieldError;
  options?: string[]; // radio/select için
  placeholder?: string;
  onFileChange?: (name: string, file: File | null) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  register,
  error,
  options,
  placeholder,
  onFileChange,
}) => {
  const [approvalValue, setApprovalValue] = useState<string | null>(null);

  return (
    <FormControl fullWidth component="fieldset" error={!!error} sx={{ mb: 3 }}>
      <FormLabel>{label}</FormLabel>

      {/* Text */}
      {type === 'text' && (
        <TextField
          placeholder={placeholder}
          variant="outlined"
          {...register(name)}
          sx={{ mt: 1 }}
        />
      )}

      {/* Radio */}
      {type === 'radio' && (
        <RadioGroup row sx={{ mt: 1 }}>
          {options?.map((opt) => (
            <FormControlLabel
              key={opt}
              value={opt}
              control={<Radio {...register(name, { required: true })} />}
              label={opt}
            />
          ))}
        </RadioGroup>
      )}

      {/* Select */}
      {type === 'select' && (
        <Select
          defaultValue=""
          {...register(name, { required: true })}
          sx={{ mt: 1 }}
        >
          <MenuItem value="">Seçiniz...</MenuItem>
          {options?.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      )}

      {/* Approval (tik/çarpı) */}
{type === 'approval' && (
  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
    {/* Soldaki başlık */}
    <Typography sx={{ minWidth: 200 }}>{label}</Typography>

    {/* Sağdaki radio seçenekleri */}
    <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {/* Uygundur */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Radio
          {...register(name, { required: true })}
          checked={approvalValue === 'uygun'}
          onChange={() => setApprovalValue('uygun')}
        />
        Uygundur, Onaylıyorum
        {approvalValue === 'uygun' && <CheckCircleIcon color="success" />}
      </Box>

      {/* Uygun Değil */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Radio
          {...register(name, { required: true })}
          checked={approvalValue === 'uygunsuz'}
          onChange={() => setApprovalValue('uygunsuz')}
        />
        Uygun Değil, Onaylamıyorum
        {approvalValue === 'uygunsuz' && <CancelIcon color="error" />}
      </Box>
    </Box>
  </Box>
)}




      {/* File/Image */}
      {(type === 'file' || type === 'image') && (
        <Box sx={{ mt: 1 }}>
          <Button variant="outlined" component="label">
            Dosya Yükle
            <input
              type="file"
              hidden
              accept={type === 'image' ? 'image/*' : undefined}
              onChange={(e) =>
                onFileChange?.(name, e.target.files ? e.target.files[0] : null)
              }
            />
          </Button>
        </Box>
      )}

      {/* Hata */}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error.message || 'Bu alan zorunludur.'}
        </Typography>
      )}
    </FormControl>
  );
};

export default FormField;
