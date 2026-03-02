<script setup lang="ts">
import {useCategoryStore} from "~/stores/products/category";
import type {BreadcrumbItem} from "#ui/components/Breadcrumb.vue";
import type {TabsItem} from "#ui/components/Tabs.vue";

const $route = useRoute()
const storeCategory = useCategoryStore()
const category = ref(null);

const lock = useLockStore()
const items = ref<any[]>([])
const lockAcquired = ref(false)
const tabs: TabsItem[] = [
  {
    label: 'Подкатегории',
    icon: 'i-lucide-user',
    value: 'children'
  },
  {
    label: 'Атрибуты',
    icon: 'i-lucide-lock',
    value: 'attribute'
  },
  {
    label: 'Товары',
    icon: 'i-lucide-lock',
    value: 'products'
  }
]
watch(() => storeCategory.category, (newProduct) => {
  if (newProduct) category.value = { ...newProduct };
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
  <AppPageWithLoader v-model="category">
    <AppTitle :name="category.name" />
    <div class="rounded-mb p-2">
 Поля данныхз
    </div>
    <UTabs :items="tabs" class="w-full" variant="link">
      <template #content="{ item }">
        <p>This is the {{ item.label }} tab.</p>
      </template>
    </UTabs>
  </AppPageWithLoader>
</template>

<style scoped>

</style>