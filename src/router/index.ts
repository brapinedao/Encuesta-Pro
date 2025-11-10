// vue - router
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// views
import homeView from '@/views/home-view.vue'
import loginView from '@/views/login-view.vue'
import surveyBuilder from '@/views/survey-builder-view.vue'

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
  {
    path: '/encuestas',
    component: authLayout,
    children: [{ path: '', name: 'survey', component: surveyBuilder }],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
