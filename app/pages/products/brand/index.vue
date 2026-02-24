<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});
const { data, status, refresh } = useHttp<any>("products/brand");
const loading = computed(() => status.value === 'pending');
console.log(data.value)
</script>

<template>
 Бренды
</template>

<style scoped>

</style>