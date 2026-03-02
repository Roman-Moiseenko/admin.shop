<script lang="ts" setup>
import {useMenuStore} from "~/stores/menu";

const auth = useAuthStore();
const menu = useMenuStore();
const userItems = menu.userItems
const items = menu.items
const isSideOpen = ref(false);

const route = useRoute();

const breadcrumbs = ref([])
/*
watch(() => breadcrumbs.value, (nv) => {
  console.log(nv);
})
*/
onMounted(() => {
  console.log('onMounted');
  watch(() => route.path, async (newPath) => {
    const url = `/breadcrumbs`


    const {data, status} = await useHttp<any>(url, {
      method: 'POST',
      body: {
        route: newPath
      },
      server: false,
      onFetchResponse({response}) {
        breadcrumbs.value = response._data // if (response.status === 200)
      }
    })
   //TODO если status = idle то запустить интервал на 1,5с и запустить useHttp повторно

  }, {immediate: true});
})
onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
})
</script>
<template>
  <header
      class="bg-background/75 backdrop-blur -mb-px sticky top-0 z-50 border-b border-dashed border-gray-200/80 dark:border-gray-800/80"
  >

    <UContainer class="flex items-center justify-between gap-3 h-16 py-2">
      <AppLogo class="lg:flex-1"/>
      <UPopover mode="hover">
        <UButton label="..." color="neutral" variant="subtle" />
        <template #content>
          <div class="p-2">
          <UBreadcrumb :items="breadcrumbs" class="lg:flex-1"/>
          </div>
        </template>
      </UPopover>
      <UNavigationMenu orientation="horizontal" :items="items" class="hidden lg:block"/>

      <div class="flex items-center justify-end gap-3 lg:flex-1">
        <AppTheme/>

        <UDropdownMenu
            v-if="auth.logged"
            :items="userItems"
            :content="{ side: 'bottom', align: 'end' }"
        >
          <ULink class="cursor-pointer">
            <UAvatar
                icon="i-heroicons-user"
                class="rounded-lg"
                size="md"
                :src="$storage(auth.user.avatar)"
                :alt="auth.user.name"
            />

          </ULink>

          <template #overview>
            <div class="text-left">
              <p>Signed in as</p>
              <p class="truncate font-medium text-neutral-900 dark:text-white">
                {{ auth.user.email }}
              </p>
            </div>
          </template>
        </UDropdownMenu>
        <UButton v-else label="Log In" to="/auth/login" variant="ghost" color="neutral"/>

        <UDrawer
            v-model:open="isSideOpen"
            direction="right"
        >
          <UButton
              class="lg:hidden"
              variant="ghost"
              color="neutral"
              icon="i-heroicons-bars-3"
          />
          <template #content>
            <div class="me-5">
              <div
                  class="flex w-3xs items-center justify-between gap-3 h-16 py-2 border-b border-dashed border-gray-200/80 dark:border-gray-800/80"
              >
                <AppLogo/>
                <UButton
                    variant="ghost"
                    color="neutral"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="isSideOpen = false"
                />
              </div>

              <div class="flex-1 py-4 sm:py-6">
                <UNavigationMenu orientation="vertical" :items="items"/>

              </div>
            </div>
          </template>
        </UDrawer>
      </div>
    </UContainer>
  </header>

</template>
