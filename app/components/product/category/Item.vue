<script setup lang="ts">


import {type CategoryCreate, useCategoriesStore} from "~/stores/products/categories";

const auth = useAuthStore();
const storeCategory = useCategoriesStore()
const $props = defineProps({
  category: Object
})


const visible_create = ref(false)
const form = reactive(<CategoryCreate>{
  name: '',
  parent_id: $props.category.id,
})
const checkChildren = ref(false)

const isChildren = computed(() => {
  return $props.category && $props.category.children.length > 0
})

const showChildren = computed(() => {
  return isChildren && checkChildren.value
})

function onUp() {
  storeCategory.up($props.category.id)
}

function onDown() {
  storeCategory.down($props.category.id)
}

function createChild() {
  storeCategory.create(form);
  visible_create.value = false
}

const showDelete = ref(false)

function deleteCategory(v: Boolean) {
  if (v) storeCategory.remove($props.category.id)
  showDelete.value = false;
}

</script>

<template>
  <div class="rounded-md flex items-center mb-1 p-1 border border-slate-200">
    <div v-if="!category">
      Загрузка ...
    </div>
    <template v-else>
      <div class="w-11" style="height: 40px;">
        <img v-if="category.image" :src="category.image" style="width: 40px; height: 40px;">
      </div>
      <div class="w-11 ml-2">
        <img v-if="category.icon" :src="category.icon" style="width: 40px; height: 40px;">
      </div>
      <div class="ml-4" style="width: 350px;">
        <ULink :to="{ name: 'products-category-id', params: {id: category.id} }">{{ category.name }}</ULink>
      </div>
      <div class="ml-4" style="width: 350px;">
        <span class="text-cyan-800 dark:text-cyan-300">/catalog/{{ category.slug }}</span>
      </div>
      <div class="ml-5 text-center" style="width: 150px;">
            <span v-if="isChildren">
                {{ category?.children.length }}
                <UButton color="info" size="xs" class="ml-2" plain @click="checkChildren = !checkChildren"
                         :icon="checkChildren ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down' "

                >
                </UButton>
            </span>
      </div>
      <div class="flex ml-5">
        <UButton v-if="auth.can('edit product')" size="sm" color="secondary" icon="i-lucide-arrow-up"
                 @click.stop="onUp()"></UButton>
        <UButton v-if="auth.can('edit product')" size="sm" color="secondary" icon="i-lucide-arrow-down"
                 @click.stop="onDown()"></UButton>
        <UPopover arrow v-model:open="visible_create">
          <UButton
              icon="i-lucide-folder-plus"
              label=""
              color="success"
              variant="subtle"
          />
          <template #content>
            <div class="p-4">
              <UInput v-model="form.name" placeholder="Дочерняя категория" color="secondary"/>
              <div class="mt-2">
                <UButton @click="visible_create = false" color="neutral" variant="outline">Отмена</UButton>
                <UButton v-if="auth.can('create product')" @click="createChild" color="secondary">Создать</UButton>
              </div>
            </div>
          </template>

        </UPopover>
        <UButton v-if="auth.can('delete product')" size="xs" color="error" @click="showDelete = true">Delete</UButton>
      </div>
    </template>
  </div>
  <div v-if="showChildren" class="pl-5 ml-2 mb-5 pb-2 pt-2">
    <ProductCategoryItem v-for="child in category.children" :key="child?.id" :category="child"/>
  </div>

  <ElementDeleteModal v-model="showDelete" name="категорию" @confirmation="deleteCategory">
    <template #body>
      Нельзя удалить категорию, которая является главной для хотя бы одного товара!
    </template>
  </ElementDeleteModal>


</template>

<style scoped>

</style>