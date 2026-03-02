<script setup lang="ts">
import {useCategoryStore} from "~/stores/products/category";
import type {BreadcrumbItem} from "#ui/components/Breadcrumb.vue";

const $route = useRoute()
const storeCategory = useCategoryStore()
const category = ref(null);

const lock = useLockStore()
const items = ref<any[]>([])
const lockAcquired = ref(false)

watch(() => storeCategory.category, (newProduct) => {
  if (newProduct) {
    category.value = { ...newProduct };
    items.value = [
      {
        icon: 'i-lucide-layout-dashboard',
        to: '/'
      },
      {
        label: 'Магазин',
        to: '/products'
      },
      {
        label: 'Категории',
        to: '/products/category'
      },
      {
        label: category.value.name,
      }
    ]
  }
}, { immediate: true });

onMounted(async () => {
  category.value = null;
  await storeCategory.loadCategory(Number($route.params.id))
  lock.acquireLock('category', category.value.id).then(result => {
    lockAcquired.value = result
    if (result) lock.startHeartbeat();
  });
})


onBeforeUnmount(() => {
  lock.releaseLock()
})
</script>

<template>
  <AppPageWithLoader v:model="category">
    <AppTitle :name="category.name" />
    {{ category?.name }}
  </AppPageWithLoader>
</template>

<style scoped>

</style>