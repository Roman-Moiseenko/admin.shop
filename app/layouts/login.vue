<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
});
</script>

<template>

    <UContainer as="main" class="flex-grow py-4 sm:py-7 flex flex-col bg-gray-700">
      <slot />
    </UContainer>

</template>
