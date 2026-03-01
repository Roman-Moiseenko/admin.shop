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
  <UBreadcrumb :items="items"/>
  Страница Магазина
</template>

<style scoped>

</style>