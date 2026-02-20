<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});
//const { categories, status, refresh } = useHttp<any>("products/category");
//const loading = computed(() => status.value === 'pending');

</script>

<template>
Категории
</template>

<style scoped>

</style>