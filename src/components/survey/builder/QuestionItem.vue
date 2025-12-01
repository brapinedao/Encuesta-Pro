<template>
  <div class="question-card">
    <label class="question-title">
      {{ local.text }}
      <span v-if="local.required" class="required">*</span>
    </label>

    <!-- Campo de texto corto -->
    <input
      v-if="local.fieldType === 'text'"
      type="text"
      class="input-field"
      placeholder="Tu respuesta..."
    />

    <!-- Campo de texto largo -->
    <textarea
      v-else-if="local.fieldType === 'textarea'"
      class="textarea-field"
      placeholder="Comparte tus comentarios..."
      rows="3"
    ></textarea>

    <!-- Opción única -->
    <div v-else-if="local.fieldType === 'radio'" class="options-group">
      <label v-for="(option, i) in local.options" :key="i" class="option-item">
        <input type="radio" :name="`${local.id}`" :value="option.id" />
        <span>{{ option.text }}</span>
      </label>
    </div>

    <!-- Selección múltiple -->
    <div v-else-if="local.fieldType === 'checkbox'" class="options-group">
      <label v-for="(option, i) in local.options" :key="i" class="option-item">
        <input type="checkbox" :value="option.id" />
        <span>{{ option.text }}</span>
      </label>
    </div>

    <!-- Controles de edición (solo modo creador) -->
    <div class="editor-controls">
      <input v-model="local.text" placeholder="Escribe la pregunta..." class="edit-input" />
      <select v-model="local.fieldType" class="type-select">
        <option value="text">Respuesta corta</option>
        <option value="textarea">Respuesta larga</option>
        <option value="radio">Opción única</option>
        <option value="checkbox">Selección múltiple</option>
      </select>

      <div v-if="['radio', 'checkbox'].includes(local.fieldType)" class="options-editor">
        <div v-for="(option, i) in local.options" :key="i" class="option-edit">
          <input v-model="option.text" placeholder="Opción..." />
          <button class="remove-option" @click="removeOption(i)">X</button>
        </div>
        <button class="add-option" @click="addOption">+ Agregar opción</button>
      </div>

      <label class="required-checkbox">
        <input type="checkbox" v-model="local.required" /> Requerida
      </label>
      <button class="delete-btn" @click="$emit('delete')">Eliminar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue
import { reactive, watch } from 'vue'

// interfaces
import type { IQuestion } from '@/interfaces/globals'

// style
import '@/styles/css/questions/item.css'

// props
const props = defineProps<{ question: IQuestion }>()
const emit = defineEmits(['update', 'delete'])
const local = reactive({ ...props.question })

// actions
const addOption = () => {
  local.options.push({
    id: Date.now(),
    text: '',
  })
}
const removeOption = (index: number) => local.options.splice(index, 1)

// watch
watch(local, () => emit('update', local), { deep: true })
</script>
