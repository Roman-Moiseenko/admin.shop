<script setup lang="ts">
import * as z from 'zod'
const auth = useAuthStore();

const showDialog = ref(false)
const getInitialFormState = () => ({
  id: null,
  name: null,
  slug: null,
  description: null,
  is_category: false,
  is_group: false,
  is_product: false,
});
const form = ref(getInitialFormState())

const $emit = defineEmits(['update:all']);
function handleUpdate(row) {
  form.value = {...row.original}
  showDialog.value = true
}

function handleCreate() {
  form.value = getInitialFormState()
  showDialog.value = true
}

function updateParameter() {
  useHttp<any>(`products/parameter/${form.value.id}`, {
        method: "post",
        body: form.value,
        async onFetchResponse({response}) {
          $emit('update:all')

          showDialog.value = false
        }
      }
  );
}

function createParameter() {
  useHttp<any>("products/parameter", {
        method: "post",
        body: form.value,
        async onFetchResponse({response}) {
          $emit('update:all')
          showDialog.value = false
        },
      }
  );
}
</script>

<template>
  <UModal v-model:open="showDialog" title="Текстовый параметр" :dismissible="false">
    <template #body>
      <UFormField label="Параметр">
        <UInput v-model="form.name" class="w-full" required placeholder="Название параметра"/>
      </UFormField>
      <UFormField label="Ссылка">
        <UInput v-model="form.slug" class="w-full" required placeholder="Ссылка параметра"/>
      </UFormField>
      <UFormField label="Описание">
        <UTextarea v-model="form.description" class="w-full" :rows="3"/>
      </UFormField>
      <UCheckbox v-model="form.is_category" label="Для категорий"/>
      <UCheckbox v-model="form.is_group" label="Для групп"/>
      <UCheckbox v-model="form.is_product" label="Для товаров"/>
    </template>
    <template #footer="{ close }">
      <UButton label="Отмена" color="neutral" variant="outline" @click="showDialog = false"/>
      <UButton v-if="form.id === null && auth.can('create product')" label="Добавить" color="neutral"
               @click="createParameter"/>
      <UButton v-if="form.id !== null && auth.can('edit product')" label="Сохранить" color="secondry"
               @click="updateParameter"/>
    </template>
  </UModal>
</template>

<style scoped>

</style>