// vue - pinia
import { defineStore } from 'pinia'
import api from '@/services/api'
import { useAlert } from '@/composables/useAlert'

// interfaces
import type {
  ILoginData,
  ILoginResponse,
  IPermissions,
  IUsersResponse,
  IUserToCreate,
} from '@/interfaces/globals'

// constants
import { SESSION_TIMEOUT } from '@/constants'

export const useLoginStore = defineStore('login', {
  state: () => ({
    data_request: null as ILoginResponse | null,
    logoutTimer: null as number | null,
    permissions: [] as IPermissions[],
    users: [] as IUsersResponse[],
  }),
  actions: {
    async login(login: ILoginData) {
      if (this.logoutTimer !== null) {
        clearTimeout(this.logoutTimer)
        this.logoutTimer = null
      }

      try {
        const response = await api.post('/login', { ...login, username: login.email })
        this.data_request = {
          ...response.data.user,
          photo: response.data.user.image,
        }
        useAlert().showAlert('Sesion iniciada correctamente', response.data.success, 3000)
        this.logoutTimer = window.setTimeout(() => {
          this.logout()
        }, SESSION_TIMEOUT)
        return true
      } catch (error) {
        useAlert().showAlert('Error al iniciar sesión verifique las credenciales', 'error', 3000)
        return false
      }
    },

    async logout() {
      if (this.logoutTimer !== null) {
        clearTimeout(this.logoutTimer)
        this.logoutTimer = null
      }
      this.data_request = null
    },

    async getPermissions() {
      this.permissions = [
        {
          title: 'Usuarios',
          childrens: [
            {
              title: 'Listar',
            },
            {
              title: 'Agregar',
            },
          ],
        },
        {
          title: 'Servicios',
          childrens: [
            {
              title: 'Listar',
            },
            {
              title: 'Agregar',
            },
          ],
        },
      ]
    },

    async getUsers() {
      try {
        const response = await api.get('/users')
        this.users = response.data

        useAlert().showAlert('Usuarios obtenidos exitosamente', 'success', 3000)
      } catch (error) {
        useAlert().showAlert('Error al obtener usuarios', 'error', 3000)
      }
    },

    async createUser(data: IUserToCreate) {
      try {
        await api.post('/users', {
          ...data,
          image:
            'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
        })
        useAlert().showAlert('Usuario creado exitosamente', 'success', 3000)

        return true
      } catch (error) {
        useAlert().showAlert('Error al crear usuario', 'error', 3000)
        return false
      }
    },

    async setPermissions() {
      this.permissions = []
    },
  },
})
