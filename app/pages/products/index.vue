<script setup lang="ts">
import type {BreadcrumbItem} from "#ui/components/Breadcrumb.vue";

const items = ref<any[]>([
  {
    icon: 'i-lucide-layout-dashboard',
    to: '/'
  },
  {
    label: 'Магазин',
   // to: '/products'
  },
])
</script>

<template>
  <AppTitle icon="i-lucide-package" name="Страница Магазина" />

</template>

<style scoped>

</style>