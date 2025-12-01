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
      <button class="filter-btn">⚙️ Filtros</button>
    </div>

    <!-- Tabs -->
    <Tabs v-model="currentTab" :tabs="tabs" :counts="counts" />

    <!-- Lista de encuestas -->
    <div class="cards">
      <div v-for="survey in filteredSurveys" :key="survey.id">
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
  </div>
</template>

<script setup>
// vue - pinia
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

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

onMounted(async () => {
  const companyId = authService.getCompanyId()
  if (companyId) {
    await surveysStore.fetchSurveysByCompany(companyId)
  }
})
</script>
