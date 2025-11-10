<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <span :class="['status', status.toLowerCase()]">{{ status }}</span>
    </div>
    <p class="description">{{ description }}</p>

    <div class="info">
      <span>👥 {{ responses }} respuestas</span>
      <span>📅 {{ date }}</span>
    </div>

    <div class="actions">
      <button class="primary">Ver Encuesta</button>
      <button class="secondary">📊 Resultados</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// interfaces
import type { ISurveyResponse } from '@/interfaces/globals'

// style
import '@/styles/css/card.css'

defineProps<ISurveyResponse>()
</script>
