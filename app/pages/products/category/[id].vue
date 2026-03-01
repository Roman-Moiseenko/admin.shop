<script setup lang="ts">
import {useCategoryStore} from "~/stores/products/category";

const $route = useRoute()
const storeCategory = useCategoryStore()
const category = ref(null);

const storeLock = useLockStore()

watch(() => storeCategory.category, (newProduct) => {
  if (newProduct) {
    category.value = { ...newProduct };
  }
}, { immediate: true });

onMounted(async () => {
  category.value = null;
  await storeCategory.loadCategory(Number($route.params.id))
})
</script>

<template>
  <div v-if="!category">
    <UProgress  :max="['Загрузка...', 'Готово']" />
    <Placeholder class="h-32" />
  </div>
  <template v-else>
    {{ category?.name }}
  </template>
</template>

<style scoped>

</style>