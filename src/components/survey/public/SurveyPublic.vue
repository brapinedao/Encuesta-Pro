<template>
  <div class="survey-public-container">
    <div v-if="loading" class="loading">Cargando encuesta...</div>

    <div v-else-if="survey" class="survey-content">
      <div class="survey-header">
        <h1>{{ survey.title }}</h1>
        <p class="survey-description">{{ survey.description }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="survey-form">
        <div v-for="question in survey.questions" :key="question.id" class="question-block">
          <label class="question-title">
            {{ question.text }}
            <span v-if="question.required" class="required">*</span>
          </label>

          <!-- Text Input -->
          <input
            v-if="question.fieldType === 'text'"
            v-model="answers[question.id]"
            type="text"
            class="input-text"
            :required="question.required"
            :disabled="isPreviewMode"
          />

          <!-- Textarea -->
          <textarea
            v-else-if="question.fieldType === 'textarea'"
            v-model="answers[question.id]"
            class="input-textarea"
            :required="question.required"
            rows="4"
            :disabled="isPreviewMode"
          ></textarea>

          <!-- Radio Buttons -->
          <div v-else-if="question.fieldType === 'radio'" class="options-group">
            <label v-for="option in question.options" :key="option.id" class="option-label">
              <input
                type="radio"
                :name="`question-${question.id}`"
                :value="option.id"
                v-model="answers[question.id]"
                :required="question.required"
                :disabled="isPreviewMode"
              />
              {{ option.text }}
            </label>
          </div>

          <!-- Checkboxes -->
          <div v-else-if="question.fieldType === 'checkbox'" class="options-group">
            <label v-for="option in question.options" :key="option.id" class="option-label">
              <input
                type="checkbox"
                :value="option.id"
                v-model="answers[question.id]"
                :disabled="isPreviewMode"
              />
              {{ option.text }}
            </label>
          </div>
        </div>

        <button v-if="!isPreviewMode" type="submit" class="submit-button" :disabled="submitting">
          {{ submitting ? 'Enviando...' : 'Enviar Respuestas' }}
        </button>
        <button v-else type="button" class="submit-button" @click="router.push('/')">Volver</button>
      </form>

      <div v-if="submitted" class="success-message">
        ¡Gracias por tu respuesta! Tus datos han sido enviados correctamente.
      </div>
    </div>

    <div v-else class="error-container">
      <div class="error-content">
        <img src="@/assets/not_found.jpg" alt="No encontrado" class="error-image" />
        <h2>Encuesta no encontrada</h2>
        <p>Lo sentimos, no pudimos encontrar la encuesta que buscas.</p>
        <p class="error-hint">
          Verifica que el enlace sea correcto o contacta con quien te lo compartió.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// stores
import { useSurveysStore } from '@/stores/surveys-store'
import { useAnswersStore } from '@/stores/answers-store'
const surveysStore = useSurveysStore()
const answersStore = useAnswersStore()

// interfaces
import type { ICreateAnswerDetailDto } from '@/interfaces/globals'

// styles
import '@/styles/css/survey/surveypublic.css'

// router
const route = useRoute()
const router = useRouter()

// data
const surveyId = parseInt(route.params.id as string)
const isPreviewMode = ref(route.query.preview === 'true')
const survey = ref(surveysStore.currentSurvey)
const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const answers = reactive<Record<number, any>>({})

onMounted(async () => {
  await surveysStore.fetchSurveyById(surveyId)
  survey.value = surveysStore.currentSurvey

  if (survey.value?.questions) {
    survey.value.questions.forEach((q) => {
      if (q.fieldType === 'checkbox') {
        answers[q.id] = []
      }
    })
  }

  loading.value = false
})

const handleSubmit = async () => {
  if (!survey.value?.questions) return

  submitting.value = true

  const details: ICreateAnswerDetailDto[] = []

  for (const [questionId, answer] of Object.entries(answers)) {
    const qId = parseInt(questionId)
    const question = survey.value.questions.find((q) => q.id === qId)

    if (!question) continue

    if (question.fieldType === 'text' || question.fieldType === 'textarea') {
      details.push({
        questionId: qId,
        textValue: answer as string,
      })
    } else if (question.fieldType === 'radio') {
      details.push({
        questionId: qId,
        optionId: answer as number,
        textValue: '',
      })
    } else if (question.fieldType === 'checkbox') {
      const selectedOptions = answer as number[]
      selectedOptions.forEach((optionId) => {
        details.push({
          questionId: qId,
          optionId: optionId,
          textValue: '',
        })
      })
    }
  }

  const success = await answersStore.submitAnswer({
    surveyId: surveyId,
    details: details,
  })

  submitting.value = false

  if (success) {
    submitted.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}
</script>
