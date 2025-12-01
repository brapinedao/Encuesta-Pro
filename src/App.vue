<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoginStore } from '@/stores/login-store'

const loginStore = useLoginStore()

onMounted(() => {
  loginStore.checkAuthStatus()
})
</script>

<template>
  <router-view />
</template>
