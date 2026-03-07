<script setup lang="ts">
const props = defineProps({
  children: {
    type: Object,
    default: null
  }
})

</script>

<template>
  <div v-if="!children.value">Loading ...</div>
  children
  {{ children }}
</template>

<style scoped>

</style>