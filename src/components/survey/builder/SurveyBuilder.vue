<template>
  <div class="survey-builder">
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

// components
import QuestionItem from '@/components/survey/builder/QuestionItem.vue'

//interfaces
import type { IQuestion } from '@/interfaces/globals'

// styles
import '@/styles/css/questions/builder.css'
import router from '@/router'

const questions = ref<IQuestion[]>([])

const addQuestion = () => {
  questions.value.push({
    id: Date.now(),
    title: 'Nueva pregunta',
    type: 'text',
    options: [],
    required: false,
  })
}

const updateQuestion = (index: number, updated: IQuestion) => {
  questions.value[index] = updated
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const saveSurvey = () => {
  console.log('Encuesta guardada:', questions.value)
}
</script>
