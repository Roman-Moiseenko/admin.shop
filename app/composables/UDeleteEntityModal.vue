<template>
  <UModal v-model:open="active" :title="_soft ? 'Пометить на удаление' : 'Удалить запись'" width="400" :close-on-click-modal="!operationIsLoading" :close-on-press-escape="!operationIsLoading">
    <template #body>
    <div class="font-medium text-md mt-2">
      Вы уверены, что хотите {{ _soft ? 'пометить на удаление' : 'удалить' }} {{ name_entity }}?
    </div>
    <div v-if="!_soft" class="text-red-600 text-md mt-2">
      Восстановить данные будет невозможно!
    </div>
    <slot /> <!-- Для дополнительного контента, если нужен -->
    </template>
    <template #footer="{ close }">
      <div class="dialog-footer">
        <UButton @click="closeModal(false)" :disabled="operationIsLoading">Отмена</UButton>
        <UButton color="error" @click="closeModal(true)" :loading="operationIsLoading">
          {{ _soft ? 'Пометить' : 'Удалить' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useDeleteEntity } from '~/composables/useDeleteEntity'; // Путь к композитной функции

const $props = defineProps({
  // 'name' пропс больше не нужен здесь, так как модальное окно одно глобальное.
  name_entity: { type: String, default: 'Сущность' },
});
// Получаем доступ к состоянию и методам из композитной функции
const { isModalActive, isSoftDelete, operationIsLoading, accept, cancel } = useDeleteEntity();
// Привязываем активность диалога к состоянию из useDeleteEntity
const active = computed({
  get: () => isModalActive.value,
  set: (val) => {
    if (!val && isModalActive.value) {
      cancel();
    }
  },
});
const _soft = isSoftDelete; // Состояние мягкого удаления
function closeModal(accepted: boolean) {
  if (accepted) {
    accept(); // Вызываем метод подтверждения из композитной функции
  } else {
    cancel(); // Вызываем метод отмены из композитной функции
  }
}
</script>
<style scoped>
/* Ваши стили для компонента, если нужны */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>