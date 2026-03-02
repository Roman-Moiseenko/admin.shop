<script lang="ts" setup>
import {useCategoriesStore} from "~/stores/products/categories";

definePageMeta({
  middleware: ['auth'],
});
//Предварительная загрузка Stores
useCategoriesStore()

</script>

<template>
  <AppHeader/>
  <UContainer as="main" class="flex-grow max-w-7xl py-4 sm:py-7 flex flex-col">
    <slot/>
  </UContainer>
  <AppFooter/>
</template>