// vue - pinia - api
import { defineStore } from 'pinia'
import api from '@/services/api'

// interfaces
import type { ISurveyResponse } from '@/interfaces/globals'

// alert
import { useAlert } from '@/composables/useAlert'

export const useHomeStore = defineStore('home', {
  state: () => ({
    surveys: [] as ISurveyResponse[],
  }),
  actions: {
    async getSurveys(id: number) {
      //   try {
      //     const response = await api.get(`/surveys/${id}`)
      //     this.surveys = response.data

      //     useAlert().showAlert('Encuestas obtenidas exitosamente', 'success', 3000)
      //   } catch (error) {
      //     useAlert().showAlert('Error al cargar las encuestas', 'error', 3000)
      //   }

      this.surveys = [
        {
          id: 1,
          title: 'Encuesta de Satisfacción del Cliente',
          description:
            'Evalúa la experiencia de nuestros clientes con nuestros productos y servicios',
          responses: 234,
          date: '15 Mar 2024',
          status: 'Activa',
        },
        {
          id: 2,
          title: 'Evaluación de Desempeño Laboral',
          description: 'Encuesta anual para evaluar el desempeño y desarrollo de los empleados',
          responses: 87,
          date: '12 Mar 2024',
          status: 'Activa',
        },
        {
          id: 3,
          title: 'Feedback de Producto',
          description: 'Recopila opiniones sobre las nuevas características del producto',
          responses: 156,
          date: '8 Mar 2024',
          status: 'Cerrada',
        },
        {
          id: 4,
          title: 'Encuesta de Clima Organizacional',
          description: 'Mide el ambiente laboral y la satisfacción de los empleados',
          responses: 0,
          date: '5 Mar 2024',
          status: 'Borrador',
        },
      ]
    },
  },
})
