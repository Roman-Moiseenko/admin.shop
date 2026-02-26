<script setup lang="ts">

import {ElementActive} from "#components";
import UDeleteEntityModal from "~/composables/UDeleteEntityModal.vue";
import { useDeleteEntity } from '~/composables/useDeleteEntity';
definePageMeta({
  middleware: ['auth'],
});
useHead({
  title: "Категории товаров"
})
const { data: categories, status: statusCategories, refresh: refreshCategories } = useHttp<any>("products/category");
const { data: list, status: statusList, refresh: refreshList } = useHttp<any>("products/category/list");
const loading = computed(() => statusCategories.value === 'pending');

watch(statusCategories, async (n, q) => {
  if (n === 'success') console.log(categories.value)
})
const getInitialFormState = () => ({
  name: null,
  slug: null,
  parent_id: null,
});
const form = ref(getInitialFormState())
const { showModal } = useDeleteEntity();
const showDialog = ref(false)

function handleCreate() {
  form.value = getInitialFormState()
  showDialog.value = true
}
function createCategory() {
  useHttp<any>("products/category", {
        method: "post",
        body: form.value,
        async onFetchResponse({response}) {
          await refreshCategories()
          showDialog.value = false
          refreshList()
        }
      }
  );
}
</script>

<template>
  <h1 class="mb-3 font-600 text-3xl">Категории</h1>
  <div>
    <UButton label="Добавить категорию" color="secondary" @click="handleCreate"/>
  </div>

  <ProductCategoryChildren :categories="categories" />

  <UModal v-model:open="showDialog" title="Добавить категорию" :dismissible="false">
    <template #body>
      <UFormField label="Название">
        <UInput v-model="form.name" class="w-full" required placeholder="Название категории"/>
      </UFormField>
      <UFormField label="Ссылка">
        <UInput v-model="form.slug" class="w-full" placeholder="Ссылка на категорию"/>
      </UFormField>
      <UFormField label="Родительская категория">
        <USelectMenu :items="list" v-model="form.parent_id" clear label-key="name" value-key="id" class="w-full"/>
      </UFormField>

    </template>
    <template #footer="{ close }">
      <UButton label="Отмена" color="neutral" variant="outline" @click="showDialog = false"/>
      <UButton label="Добавить" color="neutral" @click="createCategory"/>
    </template>
  </UModal>
  <UDeleteEntityModal name_entity="категорию" >
    <p>
      Нельзя удалить категорию, которая является главной для хотя бы одного товара!
    </p>
  </UDeleteEntityModal>
</template>

<style scoped>

</style>