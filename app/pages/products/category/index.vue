<script setup lang="ts">
import * as z from 'zod'
import UDeleteEntityModal from "~/composables/UDeleteEntityModal.vue";
import type {FormSubmitEvent} from "#ui/types";
import {type CategoryCreate, useCategoriesStore} from "~/stores/categories";

definePageMeta({
  middleware: ['auth'],
});
useHead({
  title: "Категории товаров"
})

const storeCategory = useCategoriesStore()


type Schema = z.output<typeof schema>

const getInitialFormState = () => (<CategoryCreate>{
  name: null,
  slug: null,
  parent_id: null,
});
const form = ref(getInitialFormState())

const showDialog = ref(false)

const schema = z.object({
  name: z.string('Поле обязательно'),
})

const formModal = useTemplateRef('formModal')

async function onSubmit(event: FormSubmitEvent<Schema>) {
  storeCategory.create(form.value)
}

function handleCreate() {
  form.value = getInitialFormState()
  showDialog.value = true
}
</script>

<template>
  <h1 class="mb-3 font-600 text-3xl">
    <UIcon name="i-lucide-folder-tree"/>
    Категории
  </h1>
  <div>
    <UButton label="Добавить категорию" color="secondary" @click="handleCreate"/>
  </div>

  <ProductCategoryItem v-for="category in storeCategory.categories" :key="category.id" :id="category.id"/>

  <UModal v-model:open="showDialog" title="Добавить категорию" :dismissible="false">
    <template #body>
      <UForm :schema="schema" :state="form" ref="formModal" @submit="onSubmit">
        <UFormField label="Название" name="name">
          <UInput v-model="form.name" class="w-full" required placeholder="Название категории"/>
        </UFormField>
        <UFormField label="Ссылка">
          <UInput v-model="form.slug" class="w-full" placeholder="Ссылка на категорию"/>
        </UFormField>
        <UFormField label="Родительская категория">
          <USelectMenu :items="storeCategory.list" v-model="form.parent_id" clear label-key="name" value-key="id"
                       class="w-full"/>
        </UFormField>
      </UForm>
    </template>
    <template #footer="{ close }">
      <UButton label="Отмена" color="neutral" variant="outline" @click="showDialog = false"/>
      <UButton label="Добавить" color="secondary" @click="formModal.submit()"/>
    </template>
  </UModal>

</template>

<style scoped>

</style>