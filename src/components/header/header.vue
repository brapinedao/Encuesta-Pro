<template>
  <header class="header">
    <nav class="nav container">
      <RouterLink to="/" class="nav__logo">
        <img src="@/assets/images/rednova_logo.png" alt="Logo RedNova" />
      </RouterLink>

      <div class="nav__menu">
        <ul class="nav__list">
          <li><RouterLink to="/" class="nav__link">INICIO</RouterLink></li>
          <li><RouterLink to="/servicios" class="nav__link">SERVICIOS</RouterLink></li>
          <li><RouterLink to="/nosotros" class="nav__link">NOSOTROS</RouterLink></li>
          <li><RouterLink to="/contacto" class="nav__link">CONTÁCTENOS</RouterLink></li>
        </ul>
      </div>

      <div>
        <template v-if="!data_request">
          <RouterLink to="/login" class="button button--login">LOGIN</RouterLink>
        </template>
        <template v-else>
          <div class="user-info">
            <p class="user-name">{{ data_request.name }}</p>
            <div class="user-menu" @mouseleave="showDropdown = false">
              <img
                :src="data_request.photo"
                alt="Avatar"
                class="avatar"
                @mouseenter="showDropdown = true"
                @click="showDropdown = !showDropdown"
              />
              <div v-if="showDropdown" class="dropdown">
                <RouterLink to="/admin" class="dropdown-item" @click="showDropdown = false">
                  Administración
                </RouterLink>
                <button class="dropdown-item" @click="handleLogout">Cerrar sesión</button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// vue - pinia
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import router from '@/router'

// store
import { useLoginStore } from '@/stores/login-store'

// styles
import '@/styles/css/headers.css'

const loginStore = useLoginStore()
const { data_request } = storeToRefs(loginStore)
const showDropdown = ref(false)

const handleLogout = () => {
  showDropdown.value = false
  loginStore.logout()
  router.push('/')
}
</script>
