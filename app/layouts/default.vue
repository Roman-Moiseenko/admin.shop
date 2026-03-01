<script lang="ts" setup>
import {useCategoriesStore} from "~/stores/products/categories";

definePageMeta({
  middleware: ['auth'],
});

//Предварительная загрузка Stores
useCategoriesStore()

const route = useRoute();
const currentPath = ref('');
const items = ref([])

watch(() => route.path, (newPath) => {
  currentPath.value = newPath;

  const {data, status } = useHttp<any>('/breadcrumbs', {
    method: 'GET',
    body: {route: newPath},
    onFetchResponse({response}) {
      if (response.status === 200)
        items.value = data.value
    }
  })


  console.log('Watch: Маршрут изменился на:', newPath);


}, { immediate: true });
</script>

<template>
  <AppHeader />
  <UBreadcrumb  :items="items"/>
  <UContainer as="main" class="flex-grow max-w-7xl py-4 sm:py-7 flex flex-col">
    <slot/>
  </UContainer>

  <AppFooter />

</template>