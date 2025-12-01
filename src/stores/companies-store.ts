// vue - pinia
import { defineStore } from 'pinia'
import { useAlert } from '@/composables/useAlert'

// services
import api from '@/services/api'

// interfaces
import type { ICompany, ICreateCompanyDto, IUpdateCompanyDto } from '@/interfaces/globals'

export const useCompaniesStore = defineStore('companies', {
  state: () => ({
    companies: [] as ICompany[],
    currentCompany: null as ICompany | null,
    loading: false,
  }),

  actions: {
    async fetchCompanies() {
      this.loading = true
      try {
        const response = await api.get<ICompany[]>('/api/Companies')
        this.companies = response.data
        useAlert().showAlert('Empresas cargadas exitosamente', 'success', 3000)
      } catch (error) {
        useAlert().showAlert('Error al cargar las empresas', 'error', 3000)
      } finally {
        this.loading = false
      }
    },

    async fetchCompanyById(id: number) {
      this.loading = true
      try {
        const response = await api.get<ICompany>(`/api/Companies/${id}`)
        this.currentCompany = response.data
        return response.data
      } catch (error) {
        useAlert().showAlert('Error al cargar la empresa', 'error', 3000)
        return null
      } finally {
        this.loading = false
      }
    },

    async createCompany(data: ICreateCompanyDto) {
      this.loading = true
      try {
        const response = await api.post<ICompany>('/api/Companies', data)
        this.companies.push(response.data)
        useAlert().showAlert('Empresa creada exitosamente', 'success', 3000)
        return response.data
      } catch (error) {
        useAlert().showAlert('Error al crear la empresa', 'error', 3000)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateCompany(id: number, data: IUpdateCompanyDto) {
      this.loading = true
      try {
        const response = await api.put<ICompany>(`/api/Companies/${id}`, data)
        const index = this.companies.findIndex((c) => c.id === id)
        if (index !== -1) {
          this.companies[index] = response.data
        }
        useAlert().showAlert('Empresa actualizada exitosamente', 'success', 3000)
        return response.data
      } catch (error) {
        useAlert().showAlert('Error al actualizar la empresa', 'error', 3000)
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteCompany(id: number) {
      this.loading = true
      try {
        await api.delete(`/api/Companies/${id}`)
        this.companies = this.companies.filter((c) => c.id !== id)
        useAlert().showAlert('Empresa eliminada exitosamente', 'success', 3000)
        return true
      } catch (error) {
        useAlert().showAlert('Error al eliminar la empresa', 'error', 3000)
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
