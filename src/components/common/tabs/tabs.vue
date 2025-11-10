<template>
  <div class="tabs">
    <button
      v-for="tab in normalizedTabs"
      :key="tab.value"
      :class="['tab', { active: tab.value === modelValue }]"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
      <span v-if="counts && counts[tab.label]" class="count">({{ counts[tab.label] }})</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// vue
import { computed } from 'vue'

// style
import '@/styles/css/tabs.css'

interface TabItem {
  label: string
  value: string
}

const props = defineProps<{
  tabs: string[] | TabItem[]
  modelValue: string
  counts?: Record<string, number>
}>()

const emit = defineEmits(['update:modelValue'])

const normalizedTabs = computed(() =>
  typeof props.tabs[0] === 'string'
    ? (props.tabs as string[]).map((t) => ({ label: t, value: t }))
    : (props.tabs as TabItem[]),
)
</script>
