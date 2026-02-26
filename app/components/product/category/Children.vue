<script setup lang="ts">
const $props = defineProps({
  category: {
    type: Object,
    default: null,
  },
  categories: {
    type: Object,
    default: null,
  },
})

const $emit = defineEmits(['delete:category'])
const children = computed(() => {
  return $props.category === null ? $props.categories : $props.category.children
})
</script>

<template>
 <div v-for="item in children" >
   {{ item.name }}
 </div>
</template>

<style scoped>

</style>