// vue - router
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// views
import homeView from '@/views/home-view.vue'
import loginView from '@/views/login-view.vue'
import surveyBuilder from '@/views/survey-builder-view.vue'
import surveyPublicView from '@/views/survey-public-view.vue'
import surveyResultsView from '@/views/survey-results-view.vue'
import notFoundView from '@/views/not-found-view.vue'

// layouts
import defaultLayout from '@/layouts/default/DefaultLayout.vue'
import authLayout from '@/layouts/auth/AuthLayout.vue'

// services
import { getToken } from '@/services/auth.service'
import { isTokenExpired } from '@/utils/jwt.utils'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: defaultLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'home', component: homeView }],
  },
  {
    path: '/login',
    component: authLayout,
    meta: { requiresAuth: false },
    children: [{ path: '', name: 'login', component: loginView }],
  },
  {
    path: '/encuestas',
    component: authLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'survey', component: surveyBuilder }],
  },
  {
    path: '/encuesta/:id',
    component: authLayout,
    meta: { requiresAuth: false },
    children: [{ path: '', name: 'survey-public', component: surveyPublicView }],
  },
  {
    path: '/resultados/:id',
    component: defaultLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'survey-results', component: surveyResultsView }],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: notFoundView,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guard: Verificar autenticación antes de cada navegación
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const token = getToken()
  const isAuthenticated = token && !isTokenExpired(token)

  if (requiresAuth && !isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
