import api from './api'
import type { ILoginData, IAuthTokens, IRegisterData } from '@/interfaces/globals'
import { decodeToken } from '@/utils/jwt.utils'

const TOKEN_KEY = 'encuestapro_token'
const USER_EMAIL_KEY = 'encuestapro_user_email'
const USER_ID_KEY = 'encuestapro_user_id'

// API calls
export const authApi = {
  login: (credentials: ILoginData) =>
    api.post<IAuthTokens>('/api/Auth/login', {
      email: credentials.email,
      password: credentials.password,
    }),
  register: (data: IRegisterData) => api.post('/api/Auth/register', data),
}

// Token management (localStorage)
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUserEmail(): string | null {
  return localStorage.getItem(USER_EMAIL_KEY)
}

export function setUserEmail(email: string): void {
  localStorage.setItem(USER_EMAIL_KEY, email)
}

export function removeUserEmail(): void {
  localStorage.removeItem(USER_EMAIL_KEY)
}

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY)
}

export function setUserId(userId: string): void {
  localStorage.setItem(USER_ID_KEY, userId)
}

export function removeUserId(): void {
  localStorage.removeItem(USER_ID_KEY)
}

export function getCompanyId(): number | null {
  const token = getToken()
  if (!token) return null

  const payload = decodeToken(token)
  if (!payload || !payload.companyId) return null

  return parseInt(payload.companyId)
}

export function logout(): void {
  removeToken()
  removeUserEmail()
  removeUserId()
}

export function isAuthenticated(): boolean {
  const token = getToken()
  return token !== null
}

export default {
  authApi,
  getToken,
  setToken,
  removeToken,
  getUserEmail,
  setUserEmail,
  removeUserEmail,
  getUserId,
  setUserId,
  removeUserId,
  getCompanyId,
  logout,
  isAuthenticated,
}
