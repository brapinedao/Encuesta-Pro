<template>
  <div class="survey-builder">
    <div
      class="survey-header-inputs"
      style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px"
    >
      <input
        v-model="surveyTitle"
        class="survey-title-input"
        placeholder="Título de la encuesta"
        style="font-size: 1.5rem; padding: 10px; border: 1px solid #ddd; border-radius: 4px"
      />
      <textarea
        v-model="surveyDescription"
        class="survey-desc-input"
        placeholder="Descripción de la encuesta"
        style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px"
      ></textarea>
    </div>
    <div class="questions">
      <QuestionItem
        v-for="(question, index) in questions"
        :key="question.id"
        :question="question"
        @update="updateQuestion(index, $event)"
        @delete="removeQuestion(index)"
      />
    </div>

    <button class="add-btn" @click="addQuestion">+ Agregar pregunta</button>

    <div class="actions">
      <button class="save-btn" @click="router.push('/')">Volver</button>
      <button class="save-btn" @click="saveSurvey">Guardar Encuesta</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// components
import QuestionItem from '@/components/survey/builder/QuestionItem.vue'

// store
import { useSurveysStore } from '@/stores/surveys-store'

// services
import * as authService from '@/services/auth.service'

// composables
import { useAlert } from '@/composables/useAlert'

//interfaces
import type { IQuestion } from '@/interfaces/globals'

// styles
import '@/styles/css/questions/builder.css'

const router = useRouter()
const surveysStore = useSurveysStore()
const { showAlert } = useAlert()

// Datos de la encuesta
const surveyTitle = ref('Nueva Encuesta')
const surveyDescription = ref('Descripción de la encuesta')
const questions = ref<IQuestion[]>([])

const addQuestion = () => {
  questions.value.push({
    id: Date.now(),
    text: 'Nueva pregunta',
    fieldType: 'text',
    options: [],
  })
}

const updateQuestion = (index: number, updated: IQuestion) => {
  questions.value[index] = updated
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const saveSurvey = async () => {
  const companyId = authService.getCompanyId()

  if (!companyId) {
    showAlert('Error: No se pudo identificar la empresa', 'error', 3000)
    return
  }

  if (questions.value.length === 0) {
    showAlert('Debe agregar al menos una pregunta', 'warning', 3000)
    return
  }

  const surveyPayload = {
    title: surveyTitle.value,
    description: surveyDescription.value,
    companyId: companyId,
    questions: questions.value,
  }

  const result = await surveysStore.createSurvey(surveyPayload as any)

  if (result) {
    router.push('/')
  }
}
</script>
