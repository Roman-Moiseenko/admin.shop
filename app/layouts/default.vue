<script lang="ts" setup>
import UDeleteEntityModal from "~/composables/UDeleteEntityModal.vue";

definePageMeta({
  middleware: ['auth'],
});

</script>

<template>
  <AppHeader />
  <UContainer as="main" class="flex-grow max-w-7xl py-4 sm:py-7 flex flex-col">
    <slot/>
  </UContainer>

  <AppFooter />

</template>