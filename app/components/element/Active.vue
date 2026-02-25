<template>
  <UIcon v-if="active" name="i-lucide-circle-check" class="text-green-600"></UIcon>
  <UIcon v-else name="i-lucide-circle-x" class="text-red-600"></UIcon>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

