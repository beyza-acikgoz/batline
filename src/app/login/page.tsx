'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

import useMediaQuery from '@mui/material/useMediaQuery'


// MUI
import {
  Alert,
  Button,
  Typography,
  IconButton,
  Box,
  InputAdornment,
  TextField
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

// Icons
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PersonPinIcon from '@mui/icons-material/PersonPin';
import LockOutlined from '@mui/icons-material/LockOutlined'


// Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: { maxHeight: 550 },
  [theme.breakpoints.down('lg')]: { maxHeight: 500 }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: { maxWidth: 450 },
  [theme.breakpoints.up('lg')]: { maxWidth: 600 },
  [theme.breakpoints.up('xl')]: { maxWidth: 750 }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // Sistem temasını algıla
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const mode = prefersDarkMode ? 'dark' : 'light'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    });


    const data = await res.json();

    if (!res.ok) {
        setError(data.message);
        return;
    }

    window.location.href = "/dashboard";
};



  return (
    <Box
        sx={{
        display: 'flex',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: mode === 'light' ? '#F8F7FA' : '#25293C',
        }}
    >
        {/* Sol taraf - Resim */}
        {!hidden && (
        <Box
            sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: mode === 'light' ? '#F8F7FA' : '#25293C',
            borderRadius: '20px',
            overflow: 'hidden',
            m: theme => theme.spacing(8, 0, 8, 8)
            }}
        >
            <LoginIllustration
            alt="login-illustration"
            src={`/image/pages/auth-v2-login-illustration-${mode}.png`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </Box>
        )}

        {/* Sağ taraf - Form */}
        <RightWrapper
        sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center'
        }}
        >
        <Box
            sx={{
                p: [6, 12],
                width: '100%',
                height: '100%', // sağ alanın tamamını kapsa
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // dikeyde ortala
                backgroundColor: mode === 'dark' ? '#F8F7FA' : '#25293C',
                
            }}
        >
            <Box sx={{ my: 6 }}>
            <Typography variant="h3" sx={{ mb: 1.5 , color: mode === 'light' ? '#F8F7FA' :  '#25293C'}}>
                BatLine&apos;a HoşGeldin! 👋🏻
            </Typography>
            <Typography sx={{ color: mode === 'light' ? '#F8F7FA' :  '#25293C'}}>
                Lütfen giriş bilgilerinizi girin
            </Typography>
            </Box>

            {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
                {error}
            </Alert>
            )}

            <form noValidate onSubmit={handleSubmit}>

            <Box sx={{ backgroundColor:  '#F8F7FA' ,  borderRadius: 2, boxShadow: 3, p: 2 }}>
                <TextField
                fullWidth
                name="email"
                label="E-Posta"
                type="email"
                margin="normal"
                placeholder="beyza@karluna.com"
                sx={{ }}
                slotProps={{
                    input: {
                    startAdornment: (
                        <InputAdornment position="start">
                        <PersonPinIcon />
                        </InputAdornment>
                    )
                    }
                }}
            />

            <TextField
                fullWidth
                name="password"
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                slotProps={{
                    input: {
                    startAdornment: (
                        <InputAdornment position="start">
                        <LockOutlined />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                    )
                    }
                }}
            />
            </Box>    
            <Box
                sx={{
                my: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
                }}
            >
                
                <Typography
                component={LinkStyled}
                href="/forgot-password"
                variant="body2"
                >
                Şifremi Unuttum?
                </Typography>
            </Box>

            <Button fullWidth type="submit" variant="contained" sx={{ mb: 4 }}>
                Giriş Yap
            </Button>

            </form>
        </Box>
        </RightWrapper>
    </Box>
);

}