<template>
  <div class="survey-results-container">
    <div v-if="loading" class="loading">Cargando resultados...</div>

    <div v-else-if="statistics" class="results-content">
      <div class="results-header">
        <button class="back-button" @click="router.push('/')">← Volver</button>
        <div class="header-info">
          <h1>{{ statistics.surveyTitle }}</h1>
          <div class="stats-summary">
            <div class="stat-item">
              <span class="stat-value">{{ statistics.totalResponses }}</span>
              <span class="stat-label">Respuestas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ statistics.questions.length }}</span>
              <span class="stat-label">Preguntas</span>
            </div>
          </div>
        </div>
      </div>

      <div class="results-main">
        <div class="questions-list">
          <h3>Preguntas</h3>
          <div
            v-for="(question, index) in statistics.questions"
            :key="question.questionId"
            :class="['question-item', { active: selectedQuestionIndex === index }]"
            @click="selectQuestion(index)"
          >
            <div class="question-number">{{ index + 1 }}</div>
            <div class="question-info">
              <p class="question-text">{{ question.questionText }}</p>
              <span class="question-responses">{{ question.data.length }} opciones</span>
            </div>
          </div>
        </div>

        <div class="chart-display">
          <div v-if="selectedQuestion" class="chart-content">
            <div class="chart-header">
              <h2>{{ selectedQuestion.questionText }}</h2>
              <p class="chart-subtitle">
                Tipo: {{ getQuestionTypeLabel(selectedQuestion.fieldType) }}
              </p>
            </div>

            <div
              v-if="
                selectedQuestion.fieldType === 'radio' || selectedQuestion.fieldType === 'checkbox'
              "
              class="chart-type-selector"
            >
              <button
                v-for="type in chartTypes"
                :key="type.value"
                :class="['chart-type-btn', { active: selectedChartType === type.value }]"
                @click="selectedChartType = type.value"
              >
                <component :is="type.icon" :size="16" />
                {{ type.label }}
              </button>
            </div>

            <div
              v-if="
                selectedQuestion.fieldType === 'radio' || selectedQuestion.fieldType === 'checkbox'
              "
              class="chart-wrapper"
            >
              <component
                :is="getChartComponent()"
                :data="getChartData(selectedQuestion)"
                :options="getChartOptions()"
              />
            </div>

            <div v-else class="text-field-info">
              <div class="info-card">
                <p>
                  Esta es una pregunta de tipo
                  <strong>{{ getQuestionTypeLabel(selectedQuestion.fieldType) }}</strong>
                </p>
                <p>Los usuarios podrán ingresar texto libre como respuesta.</p>
              </div>
            </div>
          </div>

          <div v-else class="no-selection">
            <p>
              <ArrowLeft :size="20" class="arrow-icon" />
              Selecciona una pregunta para ver sus detalles
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-message">
      <p>No se pudo cargar las estadísticas de la encuesta.</p>
      <button class="back-button" @click="router.push('/')">Volver al inicio</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// chart.js
import { Bar, Pie, Doughnut, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'

// lucide icons
import { BarChart3, PieChart, Circle, TrendingUp, ArrowLeft } from 'lucide-vue-next'

// stores
import { useSurveysStore } from '@/stores/surveys-store'

// interfaces
import type { ISurveyStatisticsResponse } from '@/interfaces/globals'

// styles
import '@/styles/css/survey/results.css'

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
)

const route = useRoute()
const router = useRouter()
const surveyId = parseInt(route.params.id as string)
const surveysStore = useSurveysStore()

const loading = ref(true)
const statistics = ref<ISurveyStatisticsResponse | null>(null)
const selectedQuestionIndex = ref<number | null>(null)
const selectedChartType = ref<'bar' | 'pie' | 'doughnut' | 'line'>('bar')

const chartTypes: Array<{ value: 'bar' | 'pie' | 'doughnut' | 'line'; label: string; icon: any }> =
  [
    { value: 'bar', label: 'Barras', icon: BarChart3 },
    { value: 'pie', label: 'Circular', icon: PieChart },
    { value: 'doughnut', label: 'Dona', icon: Circle },
    { value: 'line', label: 'Línea', icon: TrendingUp },
  ]

const selectedQuestion = computed(() => {
  if (selectedQuestionIndex.value !== null && statistics.value?.questions) {
    return statistics.value.questions[selectedQuestionIndex.value]
  }
  return null
})

const selectQuestion = (index: number) => {
  selectedQuestionIndex.value = index
}

const getChartComponent = () => {
  switch (selectedChartType.value) {
    case 'pie':
      return Pie
    case 'doughnut':
      return Doughnut
    case 'line':
      return Line
    default:
      return Bar
  }
}

const getChartData = (question: ISurveyStatisticsResponse['questions'][0]) => {
  const colors = [
    'rgba(37, 99, 235, 0.8)',
    'rgba(100, 116, 139, 0.8)',
    'rgba(96, 165, 250, 0.8)',
    'rgba(30, 58, 138, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(99, 102, 241, 0.8)',
    'rgba(14, 165, 233, 0.8)',
  ]

  const borderColors = colors.map((color) => color.replace('0.8', '1'))

  return {
    labels: question.data.map((item) => item.label),
    datasets: [
      {
        label: 'Respuestas',
        data: question.data.map((item) => item.value),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
      },
    ],
  }
}

const getChartOptions = () => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: selectedChartType.value === 'pie' || selectedChartType.value === 'doughnut',
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.parsed.y !== undefined ? context.parsed.y : context.parsed
            return `${label}: ${value} respuestas`
          },
        },
      },
    },
  }

  if (selectedChartType.value === 'bar' || selectedChartType.value === 'line') {
    return {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    }
  }

  return baseOptions
}

const getQuestionTypeLabel = (fieldType: string) => {
  const labels: Record<string, string> = {
    text: 'Respuesta corta',
    textarea: 'Respuesta larga',
    radio: 'Opción única',
    checkbox: 'Selección múltiple',
  }
  return labels[fieldType] || fieldType
}

onMounted(async () => {
  loading.value = true

  const data = await surveysStore.fetchSurveyStatistics(surveyId)

  if (data) {
    statistics.value = data

    if (statistics.value?.questions && statistics.value.questions.length > 0) {
      selectedQuestionIndex.value = 0
    }
  }

  loading.value = false
})
</script>
