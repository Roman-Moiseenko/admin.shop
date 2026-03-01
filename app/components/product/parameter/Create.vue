<script setup lang="ts">
import {type TextParameter, useParametersStore} from "~/stores/products/parameters";
import * as z from 'zod'
import type {FormSubmitEvent} from "#ui/types";
type Schema = z.output<typeof schema>

const auth = useAuthStore()
const storeParameters = useParametersStore()
const show = ref(false)
const form = ref<TextParameter>(storeParameters.getInitialFormState())
const formModal = useTemplateRef('formModal')
const schema = storeParameters.schemaValidate

const showEdit = () => {
  form.value = storeParameters.getInitialFormState()
  show.value = true
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  storeParameters.create(form.value)
  show.value = false
}

defineExpose({showEdit})
</script>

<template>
  <UModal v-model:open="show" title="Создать текстовый параметр" :dismissible="false">
    <template #body>
      <UForm :schema="schema" :state="form" ref="formModal" @submit="onSubmit">
        <UFormField label="Параметр" name="name">
          <UInput v-model="form.name" class="w-full" placeholder="Название параметра"/>
        </UFormField>

        <UFormField label="Ссылка" name="slug">
          <UInput v-model="form.slug" class="w-full" placeholder="Ссылка параметра"/>
        </UFormField>
        <UFormField label="Описание">
          <UTextarea v-model="form.description" class="w-full" :rows="3"/>
        </UFormField>

        <UCheckbox v-model="form.is_category" label="Для категорий" name="is1"/>

        <UCheckbox v-model="form.is_group" label="Для групп"/>
        <UCheckbox v-model="form.is_product" label="Для товаров"/>

      </UForm>
    </template>
    <template #footer="{ close }">
      <UButton label="Отмена" color="neutral" variant="outline" @click="show = false"/>
      <UButton v-if="form.id === null && auth.can('create product')"
               label="Добавить" color="secondary"
               @click="formModal.submit()"/>
    </template>
  </UModal>
</template>

<style scoped>

</style>