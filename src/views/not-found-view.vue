<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <img src="@/assets/not_found.jpg" alt="Página no encontrada" class="not-found-image" />
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe o no tienes permiso para acceder a ella.</p>
      <router-link to="/" class="back-button">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue
import { RouterLink } from 'vue-router'

// styles
import '@/styles/css/not_found.css'
</script>
