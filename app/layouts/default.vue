<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
});

console.log("default")
</script>

<template>
  <AppHeader />
  <UContainer as="main" class="flex-grow max-w-7xl py-4 sm:py-7 flex flex-col">
    <slot/>
  </UContainer>

  <AppFooter />

</template>