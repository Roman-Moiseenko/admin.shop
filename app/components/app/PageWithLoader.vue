<script setup lang="ts">
const model = defineModel()

const props = defineProps({
  is_loading: Boolean
})
</script>

<template>
  <div v-if="!model">
    <UProgress :max="['Загрузка...', 'Готово']"/>
    //TODO Сделать красивый блок
  </div>
  <template v-else><slot/></template>
</template>

<style scoped>

</style>