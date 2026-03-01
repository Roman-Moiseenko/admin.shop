<script setup lang="ts">
const props = defineProps({
  icon: String,
  name: String
})
</script>

<template>
  <h1 class="mb-3 font-600 text-3xl pb-1">
    <UIcon v-if="icon" :name="icon"/>
    {{ name }}
  </h1>
</template>

<style scoped>

</style>