import axios from 'axios'
import { getToken, removeToken } from './auth.service'
import { isTokenExpired } from '@/utils/jwt.utils'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token) {
      if (isTokenExpired(token)) {
        removeToken()
        window.location.href = '/login'
        return Promise.reject(new Error('Token expirado'))
      }

      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default api
