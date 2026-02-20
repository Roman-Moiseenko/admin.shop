<script lang="ts" setup>

const route = useRoute()
const layout = (route.name == 'auth-login' || route.name == undefined)  ? 'tologin' : 'auth';

console.log("default") //:name="layout"
</script>

<template>

  <slot  />

  <NuxtLoadingIndicator class="!opacity-100" :throttle="0" />
</template>
