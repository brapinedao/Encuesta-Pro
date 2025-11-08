<template>
  <div class="login-container">
    <div class="login-card">
      <RouterLink to="/" class="close-btn">×</RouterLink>
      <img src="@/assets/images/rednova_logo.png" alt="Logo RedNova" class="login-logo" />
      <h2 style="margin-top: 2px">Login</h2>

      <form @submit.prevent="handleLogin" style="margin-top: 8px">
        <div class="form-group">
          <input type="text" v-model="data_login.email" placeholder="Usuario" required />
        </div>
        <div class="form-group">
          <input type="password" v-model="data_login.password" placeholder="Password" required />
        </div>

        <div class="form-footer">
          <label>
            <input type="checkbox" v-model="data_login.remember" />
            Recuérdame
          </label>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" class="login-btn">Iniciar Sesión</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue - pinia
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import router from '@/router'

// scoped style
import '@/styles/css/login.css'

// interface
import type { ILoginData } from '@/interfaces/globals'

// store
import { useLoginStore } from '@/stores/login-store'
const loginStore = useLoginStore()
const { login } = loginStore

// composables
import { useUtils } from '@/composables/useUtils'
import { useAlert } from '@/composables/useAlert'

// models
const data_login = ref<ILoginData>({
  email: '',
  password: '',
  remember: false,
})

// actions
const handleLogin = async () => {
  if (useUtils().isEmptyOrZero(data_login.value))
    return useAlert().showAlert('Asegurese de rellenar todos los campos', 'error')

  if (await login(data_login.value)) {
    router.push('/')
    return useAlert().showAlert('Sesion iniciada con éxito', 'success')
  }
}
</script>
