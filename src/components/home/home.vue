<template>
  <div class="surveys">
    <h1 class="title">Mis Encuestas</h1>
    <p class="subtitle">Gestiona y visualiza todas tus encuestas en un solo lugar</p>

    <!-- Buscador y Filtros -->
    <div class="toolbar">
      <input type="text" placeholder="🔍 Buscar encuestas..." class="search" />
      <button class="filter-btn">⚙️ Filtros</button>
    </div>

    <!-- Tabs -->
    <Tabs v-model="currentTab" :tabs="tabs" :counts="counts" />

    <!-- Lista de encuestas -->
    <div class="cards">
      <div v-for="survey in filteredSurveys" :key="survey.id">
        <Card
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
import { useHomeStore } from '@/stores/home-store'

// imports
const { getSurveys } = useHomeStore()
const { surveys } = storeToRefs(useHomeStore())

// tabs
const currentTab = ref('Todas')
const tabs = ['Todas', 'Activas', 'Borradores', 'Cerradas']
const counts = computed(() => ({
  Todas: surveys.value.length,
  Activas: surveys.value.filter((s) => s.status === 'Activa').length,
  Borradores: surveys.value.filter((s) => s.status === 'Borrador').length,
  Cerradas: surveys.value.filter((s) => s.status === 'Cerrada').length,
}))
const filteredSurveys = computed(() => {
  if (currentTab.value === 'Todas') return surveys.value
  return surveys.value.filter((s) => s.status === currentTab.value.slice(0, -1))
})

onMounted(async () => {
  getSurveys(1)
})
</script>

<style scoped>
/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.search {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.filter-btn {
  margin-left: 1rem;
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
}
</style>
