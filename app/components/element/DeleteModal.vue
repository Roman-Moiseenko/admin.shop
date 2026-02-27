<script setup lang="ts">
const model  = defineModel()

const $props = defineProps({
  name: String,
  _soft: {
    type: Boolean,
    default: false,
  }
})
const $emit = defineEmits(['confirmation'])

function confirmation()
{
  $emit('confirmation', true)
  model.value = false
}
</script>

<template>
  <UModal v-model:open="model" :title="_soft ? 'Пометить на удаление' : 'Удалить запись'" width="400">
    <template #body>
      <div class="font-medium text-md mt-2">
        Вы уверены, что хотите {{ _soft ? 'пометить на удаление' : 'удалить' }} {{ name }}?
      </div>
      <div v-if="!_soft" class="text-red-600 text-md mt-2">
        Восстановить данные будет невозможно!
      </div>
      <slot /> <!-- Для дополнительного контента, если нужен -->
    </template>
    <template #footer="{ close }">
      <div class="dialog-footer">
        <UButton @click="model = false" color="neutral" variant="outline">Отмена</UButton>
        <UButton color="error" @click="confirmation" >
          {{ _soft ? 'Пометить' : 'Удалить' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>