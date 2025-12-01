<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <span :class="['status', status.toLowerCase()]">{{ status }}</span>
    </div>
    <p class="description">{{ description }}</p>

    <div class="info">
      <span class="info-item">
        <Users :size="16" />
        {{ responses }} respuestas
      </span>
      <span class="info-item">
        <Calendar :size="16" />
        {{ date }}
      </span>
    </div>

    <div class="actions">
      <button class="primary" @click="viewSurvey">Ver Encuesta</button>
      <button class="secondary" @click="viewResults">
        <BarChart3 :size="16" />
        Resultados
      </button>
      <button class="secondary" @click="copyPublicLink" title="Copiar link público">
        <component :is="copied ? Check : Link" :size="16" />
        {{ copied ? 'Copiado' : 'Copiar Link' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// lucide icons
import { Users, Calendar, BarChart3, Link, Check } from 'lucide-vue-next'

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
const router = useRouter()

const viewSurvey = () => {
  router.push({ path: `/encuesta/${props.id}`, query: { preview: 'true' } })
}

const viewResults = () => {
  router.push(`/resultados/${props.id}`)
}

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
    useAlert().showAlert('Error al copiar el link', 'error', 2000)
  }
}
</script>
