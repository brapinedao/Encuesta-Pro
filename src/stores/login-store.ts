// vue - pinia
import { defineStore } from 'pinia'

// composables
import { useAlert } from '@/composables/useAlert'

// router
import router from '@/router'

// services
import * as authService from '@/services/auth.service'

// stores
import { useSurveysStore } from '@/stores/surveys-store'
import { useCompaniesStore } from '@/stores/companies-store'

// utils
import { isTokenExpired, getTokenTimeRemaining } from '@/utils/jwt.utils'

// interfaces
import type {
  ILoginData,
  IRegisterData,
  ILoginResponse,
  IPermissions,
  IUsersResponse,
} from '@/interfaces/globals'

export const useLoginStore = defineStore('login', {
  state: () => ({
    data_request: null as ILoginResponse | null,
    logoutTimer: null as number | null,
    tokenCheckInterval: null as number | null,
    permissions: [] as IPermissions[],
    users: [] as IUsersResponse[],
  }),

  getters: {
    isAuthenticated(): boolean {
      const token = authService.getToken()
      if (!token) return false
      return !isTokenExpired(token)
    },

    currentUser(): ILoginResponse | null {
      return this.data_request
    },

    userEmail(): string | null {
      return authService.getUserEmail()
    },

    userId(): string | null {
      return authService.getUserId()
    },
  },

  actions: {
    async login(login: ILoginData) {
      try {
        const response = await authService.authApi.login(login)
        const data = response.data

        authService.setToken(data.token)
        authService.setUserEmail(data.email)
        authService.setUserId(data.userId)

        this.data_request = {
          name: data.email.split('@')[0] || 'Usuario',
          email: data.email,
          photo:
            'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
        }

        useAlert().showAlert('Sesión iniciada correctamente', 'success', 3000)

        this.startTokenExpirationCheck()

        return true
      } catch (error) {
        useAlert().showAlert('Error al iniciar sesión, verifique las credenciales', 'error', 3000)
        return false
      }
    },

    async logout() {
      this.stopTokenExpirationCheck()
      this.data_request = null
      authService.logout()

      const surveysStore = useSurveysStore()
      const companiesStore = useCompaniesStore()
      surveysStore.$reset()
      companiesStore.$reset()

      useAlert().showAlert('Sesión cerrada', 'info', 2000)

      router.push('/login')
    },

    startTokenExpirationCheck() {
      this.stopTokenExpirationCheck()

      const token = authService.getToken()
      if (!token) return

      this.tokenCheckInterval = window.setInterval(() => {
        const currentToken = authService.getToken()

        if (!currentToken || isTokenExpired(currentToken)) {
          useAlert().showAlert('Su sesión ha expirado', 'warning', 3000)
          this.logout()
          return
        }

        const timeRemaining = getTokenTimeRemaining(currentToken)
        if (timeRemaining < 5 * 60 * 1000 && timeRemaining > 4.5 * 60 * 1000) {
          useAlert().showAlert('Su sesión expirará pronto, guarde su trabajo', 'warning', 5000)
        }
      }, 30000)
    },

    stopTokenExpirationCheck() {
      if (this.tokenCheckInterval !== null) {
        clearInterval(this.tokenCheckInterval)
        this.tokenCheckInterval = null
      }

      if (this.logoutTimer !== null) {
        clearTimeout(this.logoutTimer)
        this.logoutTimer = null
      }
    },

    checkAuthStatus() {
      const token = authService.getToken()
      const email = authService.getUserEmail()

      if (token && !isTokenExpired(token) && email) {
        this.data_request = {
          name: email.split('@')[0] || 'Usuario',
          email: email,
          photo:
            'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
        }

        this.startTokenExpirationCheck()
      } else {
        this.stopTokenExpirationCheck()
        this.data_request = null
        authService.logout()
      }
    },

    async register(data: IRegisterData) {
      try {
        await authService.authApi.register(data)
        useAlert().showAlert('Usuario registrado exitosamente', 'success', 3000)
        return true
      } catch (error) {
        useAlert().showAlert('Error al registrar usuario', 'error', 3000)
        return false
      }
    },
  },
})
