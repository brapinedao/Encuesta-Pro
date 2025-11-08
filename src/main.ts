import { createApp } from 'vue'
import { createPinia } from 'pinia'
// @ts-ignore: no type declarations for pinia-plugin-persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// import '@/styles/css/styles.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
