<template>
  <div class="surveys">
    <div class="title-bar">
      <h1 class="title">Mis Encuestas</h1>
      <RouterLink to="/encuestas" class="new-survey-btn">
        <span class="plus">+</span>
        Nueva Encuesta
      </RouterLink>
    </div>
    <p class="subtitle">Gestiona y visualiza todas tus encuestas en un solo lugar</p>

    <!-- Buscador y Filtros -->
    <div class="toolbar">
      <input type="text" placeholder="Buscar encuestas..." class="search" />
      <button class="filter-btn">
        <Settings :size="16" />
        Filtros
      </button>
    </div>

    <!-- Tabs -->
    <Tabs v-model="currentTab" :tabs="tabs" :counts="counts" />

    <!-- Lista de encuestas -->
    <div class="cards">
      <div v-for="survey in paginatedSurveys" :key="survey.id">
        <Card
          :id="survey.id"
          :title="survey.title"
          :description="survey.description"
          :responses="survey.responses"
          :date="survey.date"
          :status="survey.status"
        />
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="filteredSurveys.length > 0" class="pagination">
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ filteredSurveys.length }} encuestas
      </div>

      <div class="pagination-controls">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage = 1">
          <ChevronsLeft :size="16" />
        </button>
        <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
          <ChevronLeft :size="16" />
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="['page-number', { active: page === currentPage }]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <ChevronRight :size="16" />
        </button>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage = totalPages"
        >
          <ChevronsRight :size="16" />
        </button>
      </div>

      <div class="items-per-page">
        <label>Por página:</label>
        <select v-model="itemsPerPage" @change="currentPage = 1">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
// vue - pinia
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// lucide icons
import { Settings, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-vue-next'

// components
import Card from '@/components/common/card/card.vue'
import Tabs from '@/components/common/tabs/tabs.vue'

// store
import { useSurveysStore } from '@/stores/surveys-store'
import * as authService from '@/services/auth.service'

// styles
import '@/styles/css/home.css'

// imports
const surveysStore = useSurveysStore()
const { surveys } = storeToRefs(surveysStore)

// tabs
const currentTab = ref('Todas')
const tabs = ['Todas', 'Activas', 'Borradores', 'Cerradas']

// pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const counts = computed(() => ({
  Todas: surveys.value.length,
  Activas: surveys.value.filter((s) => s.isActive).length,
  Borradores: 0,
  Cerradas: surveys.value.filter((s) => !s.isActive).length,
}))

const filteredSurveys = computed(() => {
  let filtered = []
  if (currentTab.value === 'Todas') {
    filtered = surveys.value
  } else if (currentTab.value === 'Activas') {
    filtered = surveys.value.filter((s) => s.isActive)
  } else if (currentTab.value === 'Cerradas') {
    filtered = surveys.value.filter((s) => !s.isActive)
  } else if (currentTab.value === 'Borradores') {
    filtered = []
  }

  return filtered.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    responses: s.responsesCount,
    date: new Date(s.createdAt || Date.now()).toLocaleDateString(),
    status: s.isActive ? 'Activa' : 'Cerrada',
  }))
})

const totalPages = computed(() => Math.ceil(filteredSurveys.value.length / itemsPerPage.value))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, filteredSurveys.value.length),
)

const paginatedSurveys = computed(() => {
  return filteredSurveys.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const originalTab = currentTab.value
const unwatchTab = computed(() => {
  if (currentTab.value !== originalTab) {
    currentPage.value = 1
  }
  return currentTab.value
})

onMounted(async () => {
  const companyId = authService.getCompanyId()
  if (companyId) {
    await surveysStore.fetchSurveysByCompany(companyId)
  }
})
</script>
