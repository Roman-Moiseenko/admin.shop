<script setup lang="ts">
import {type TextParameter, useParametersStore} from "~/stores/products/parameters";
import * as z from 'zod'
import type {FormSubmitEvent} from "#ui/types";
type Schema = z.output<typeof schema>

const auth = useAuthStore()
const lock = useLockStore()
const storeParameters = useParametersStore()
const show = ref(false)
const form = ref<TextParameter>(storeParameters.getInitialFormState())
const formModal = useTemplateRef('formModal')
const schema = storeParameters.schemaValidate
const lockAcquired = ref(false)


const showEdit = (parameter: TextParameter) => {
  form.value = {...parameter}
  //Блокируем на использование
  lock.acquireLock('parameter', parameter.id).then(result => {
    lockAcquired.value = result
    if (result) lock.startHeartbeat();
  });
  show.value = true
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  storeParameters.update(form.value.id, form.value)
  onClose()
}

function onClose() {
  show.value = false
  lock.releaseLock()
}

defineExpose({showEdit})

//не обязательно
onBeforeUnmount(() => {
  onClose()
})

</script>

<template>
  <UModal v-model:open="show" title="Редактировать текстовый параметр" :dismissible="false">
    <template #body>
      <UForm :schema="schema" :state="form" ref="formModal" @submit="onSubmit">
        <UFormField label="Параметр" name="name">
          <UInput v-model="form.name" class="w-full" placeholder="Название параметра" :disabled="!lockAcquired"/>
        </UFormField>
        <UFormField label="Ссылка" name="slug">
          <UInput v-model="form.slug" class="w-full" placeholder="Ссылка параметра" :disabled="!lockAcquired"/>
        </UFormField>
        <UFormField label="Описание">
          <UTextarea v-model="form.description" class="w-full" :rows="3" :disabled="!lockAcquired"/>
        </UFormField>

        <UCheckbox v-model="form.is_category" label="Для категорий"  :disabled="!lockAcquired"/>
        <UCheckbox v-model="form.is_group" label="Для групп" :disabled="!lockAcquired"/>
        <UCheckbox v-model="form.is_product" label="Для товаров" :disabled="!lockAcquired"/>
      </UForm>
    </template>
    <template #footer="{ close }">
      <UButton label="Отмена" color="neutral" variant="outline" @click="onClose"/>
      <UButton v-if="form.id !== null && auth.can('edit product')"
               label="Сохранить" color="secondary"
               @click="formModal.submit()" :disabled="!lockAcquired"/>
    </template>
  </UModal>
</template>

<style scoped>

</style>