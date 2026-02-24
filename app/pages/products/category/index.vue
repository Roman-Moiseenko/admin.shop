<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});
const { data, status, refresh } = useHttp<any>("products/category");
const loading = computed(() => status.value === 'pending');

watch(status, async (n, q) => {
  if (n === 'success') console.log(data.value)
})

</script>

<template>
  Категории Товаров
</template>

<style scoped>

</style>