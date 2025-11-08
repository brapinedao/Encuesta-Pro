import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// vistas
import homeView from '@/views/home-view.vue'
import loginView from '@/views/login-view.vue'

// layouts
import defaultLayout from '@/layouts/default/DefaultLayout.vue'
import authLayout from '@/layouts/auth/AuthLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: defaultLayout,
    children: [{ path: '', name: 'home', component: homeView }],
  },
  {
    path: '/login',
    component: authLayout,
    children: [{ path: '', name: 'login', component: loginView }],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
