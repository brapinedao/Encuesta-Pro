<template>
  <div class="layout-container">
    <Header ref="headerRef" />
    <main :style="{ paddingTop: headerHeight + 'px' }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Header from '@/components/header/header.vue'

const headerRef = ref<InstanceType<typeof Header> | null>(null)
const headerHeight = ref(0)

const updateHeight = () => {
  if (headerRef.value?.$el) {
    headerHeight.value = headerRef.value.$el.offsetHeight
  }
}

onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight)
})
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
