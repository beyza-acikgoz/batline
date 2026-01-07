"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  Radio,
  TextField,
  Button,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/tr";

export default function ApprovalGroup({
  field,
  register,
  control,
  errors,
}: any) {
  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Typography sx={{ mb: 1, fontWeight: 500 }}>
        {field.label}
      </Typography>

      {/* ========= RADIO ========= */}
      {field.type === "radio" && (
        <Controller
          name={field.name}
          control={control}
          rules={{
            required: field.required && "Bu alan zorunludur",
          }}
          render={({ field: ctrl }) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // ✅ her zaman alt alta
                gap: 1.5,
              }}
            >
              {field.options.map((opt: any) => (
                <Box
                  key={opt.value}
                  onClick={() => ctrl.onChange(opt.value)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor:
                      ctrl.value === opt.value
                        ? "primary.main"
                        : "divider",
                    bgcolor:
                      ctrl.value === opt.value
                        ? "action.selected"
                        : "background.paper",
                    cursor: "pointer",
                  }}
                >
                  <Radio
                    size="small"
                    checked={ctrl.value === opt.value}
                  />
                  <Typography variant="body2">
                    {opt.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        />
      )}
    
 

      {/* ========= TEXT ========= */}
      {field.type === "text" && (
        <TextField
          fullWidth
          size="small"  
          {...register(field.name, {
            required: field.required && "Bu alan zorunludur",
          })}
          error={!!errors?.[field.name]}
          helperText={errors?.[field.name]?.message}
        />
      )}

      {/* ========= DATE ========= */}
      {field.type === "date" && (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="tr"
        >
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: field.required && "Bu alan zorunludur",
            }}
            render={({ field: ctrl }) => (
              <DatePicker
                format="DD/MM/YYYY"
                value={ctrl.value ? dayjs(ctrl.value) : null}
                onChange={(val) =>
                  ctrl.onChange(val ? val.toISOString() : null)
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    error: !!errors?.[field.name],
                    helperText: errors?.[field.name]?.message,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      )}

      {/* ========= FILE ========= */}
      {field.type === "file" && (
        <Controller
          name={field.name}
          control={control}
          rules={{
            required: field.required && "Bu alan zorunludur",
          }}
          render={({ field: ctrl }) => (
            <Box>
              <Button variant="outlined" component="label">
                Dosya Yükle
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    ctrl.onChange(e.target.files?.[0] || null)
                  }
                />
              </Button>

              {ctrl.value && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Seçilen dosya: {ctrl.value.name}
                </Typography>
              )}
            </Box>
          )}
        />
      )}

      {/* ========= ERROR ========= */}
      {errors?.[field.name] && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {errors[field.name]?.message}
        </Typography>
      )}
    </Box>
  );
}
