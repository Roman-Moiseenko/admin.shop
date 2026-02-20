<script lang="ts" setup>
const route = useRoute()
const layout = (route.name == 'auth-login' || route.name == undefined)  ? 'tologin' : 'auth';

//console.log(route.name, layout)
// :name="layout"
</script>

<template>
  <UApp>
    <NuxtLayout >
      <NuxtPage/>
    </NuxtLayout>
    <NuxtLoadingIndicator class="!opacity-100" :throttle="0" />
  </UApp>
</template>
