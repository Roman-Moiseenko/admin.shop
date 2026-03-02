<script lang="ts" setup>
</script>

<template>
  <UApp>
    <NuxtLayout >
      <NuxtPage/>
    </NuxtLayout>
    <NuxtLoadingIndicator class="!opacity-100" :throttle="0" color="secondary" />
  </UApp>
</template>
