<script setup lang="ts">
  const model = defineModel()

</script>

<template>
  <div v-if="!model">
    <UProgress  :max="['Загрузка...', 'Готово']" />
    //TODO Сделать красивый блок
  </div>
  <template v-else>
    <div>
      *
    </div>
    <slot />
  </template>
</template>

<style scoped>

</style>