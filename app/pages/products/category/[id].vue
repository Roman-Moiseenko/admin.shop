<script setup lang="ts">
const $route = useRoute()
const storeCategory = useCategoriesStore()
const category = await storeCategory.getCategory(Number($route.params.id))

</script>

<template>
{{ category?.name }}
</template>

<style scoped>

</style>