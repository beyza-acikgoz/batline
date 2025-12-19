export interface JwtPayload {
  id: string
  username: string
  role: 'Operatör' | 'Kalite Mühendisi' | 'Test Mühendisi' | 'Yetkin'
  iat?: number
  exp?: number
}