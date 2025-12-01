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
      <button class="secondary" @click="copyPublicLink" title="Copiar link público">
        {{ copied ? '✓ Copiado' : '🔗 Copiar Link' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue
import { ref } from 'vue'

// composables
import { useAlert } from '@/composables/useAlert'

// style
import '@/styles/css/card.css'

const props = defineProps<{
  id: number
  title: string
  description: string
  responses: number
  date: string
  status: string
}>()
const copied = ref(false)

const copyPublicLink = async () => {
  const link = `${window.location.origin}/encuesta/${props.id}`

  try {
    await navigator.clipboard.writeText(link)
    copied.value = true
    useAlert().showAlert('Link copiado al portapapeles', 'success', 2000)

    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Error al copiar:', error)
    useAlert().showAlert('Error al copiar el link', 'error', 2000)
  }
}
</script>
