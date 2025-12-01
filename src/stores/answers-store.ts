// vue - pinia
import { defineStore } from 'pinia'

// composables
import { useAlert } from '@/composables/useAlert'

// api
import api from '@/services/api'

// interfaces
import type { ICreateAnswerDto, IAnswerDto } from '@/interfaces/globals'

export const useAnswersStore = defineStore('answers', {
  state: () => ({
    loading: false,
    currentAnswer: null as IAnswerDto | null,
  }),

  actions: {
    async submitAnswer(data: ICreateAnswerDto) {
      this.loading = true
      try {
        const response = await api.post<IAnswerDto>('/api/Answers', data)
        this.currentAnswer = response.data
        useAlert().showAlert('¡Respuesta enviada exitosamente!', 'success', 3000)
        return true
      } catch (error) {
        useAlert().showAlert('Error al enviar la respuesta', 'error', 3000)
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
