<script setup lang="ts">
const model = defineModel()

const props = defineProps({
  is_loading: Boolean
})
console.log(model.value._value, Object.keys(model.value).length)
// || !model?.value
</script>

<template>
  <div v-if="!model || Object.keys(model).length == 0 ">
    <UProgress :max="['Загрузка...', 'Готово']"/>
    //TODO Сделать красивый блок
  </div>
  <template v-else><slot/></template>
</template>

<style scoped>

</style>