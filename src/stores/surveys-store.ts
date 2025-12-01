// vue - pinia
import { defineStore } from 'pinia'

// composables
import { useAlert } from '@/composables/useAlert'

// services
import api from '@/services/api'

// interfaces
import type { ISurvey, ICreateSurveyDto, IUpdateSurveyDto } from '@/interfaces/globals'

export const useSurveysStore = defineStore('surveys', {
  state: () => ({
    surveys: [] as ISurvey[],
    currentSurvey: null as ISurvey | null,
    loading: false,
  }),

  getters: {
    activeSurveys(): ISurvey[] {
      return this.surveys.filter((survey) => survey.isActive)
    },

    inactiveSurveys(): ISurvey[] {
      return this.surveys.filter((survey) => !survey.isActive)
    },
  },

  actions: {
    async fetchSurveys() {
      this.loading = true
      try {
        const response = await api.get<ISurvey[]>('/api/Surveys')
        this.surveys = response.data
        useAlert().showAlert('Encuestas cargadas exitosamente', 'success', 3000)
      } catch (error) {
        useAlert().showAlert('Error al cargar las encuestas', 'error', 3000)
      } finally {
        this.loading = false
      }
    },

    async fetchSurveysByCompany(companyId: number) {
      this.loading = true
      try {
        const response = await api.get<ISurvey[]>(`/api/Surveys?companyId=${companyId}`)
        this.surveys = response.data
        useAlert().showAlert('Encuestas de la empresa cargadas', 'success', 3000)
      } catch (error) {
        useAlert().showAlert('Error al cargar las encuestas', 'error', 3000)
      } finally {
        this.loading = false
      }
    },

    async fetchSurveyById(id: number) {
      this.loading = true
      try {
        const response = await api.get<ISurvey>(`/api/Surveys/${id}`)
        this.currentSurvey = response.data
        return response.data
      } catch (error) {
        useAlert().showAlert('Error al cargar la encuesta', 'error', 3000)
        return null
      } finally {
        this.loading = false
      }
    },

    async createSurvey(data: ICreateSurveyDto) {
      this.loading = true
      try {
        const response = await api.post<ISurvey>('/api/Surveys', data)
        this.surveys.push(response.data)
        useAlert().showAlert('Encuesta creada exitosamente', 'success', 3000)
        return response.data
      } catch (error) {
        useAlert().showAlert('Error al crear la encuesta', 'error', 3000)
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteSurvey(id: number) {
      this.loading = true
      try {
        await api.delete(`/api/Surveys/${id}`)
        this.surveys = this.surveys.filter((s) => s.id !== id)
        useAlert().showAlert('Encuesta eliminada exitosamente', 'success', 3000)
        return true
      } catch (error) {
        useAlert().showAlert('Error al eliminar la encuesta', 'error', 3000)
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
