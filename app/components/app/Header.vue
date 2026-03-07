<script lang="ts" setup>
import {useMenuStore} from "~/stores/menu";

const auth = useAuthStore();
const menu = useMenuStore();
const userItems = menu.userItems
const items = menu.items
const isSideOpen = ref(false);
const subMenu = ref(<any>[])
const route = useRoute();

const breadcrumbs = ref([])

const firstRoute = ref('')
const secondRoute = ref('')
/*
watch(() => breadcrumbs.value, (nv) => {
  console.log(nv);
})
*/
onMounted(() => {
  watch(() => route.path, async (newPath) => {
    const {data, status} = await useHttp<any>(`/breadcrumbs`, {
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

    const arr = route.path.split('/').filter(v => v !== '')
    firstRoute.value = arr[0] ?? ''
    secondRoute.value = arr[1] ?? ''
    subMenu.value = menu.getItem(firstRoute.value)?.children ?? null
   // console.log(firstRoute.value , subMenu.value)
    //console.log(subMenu.value)
  }, {immediate: true});
})


onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
})
</script>
<template>
  <header
      class="bg-background/75 backdrop-blur -mb-px sticky top-0 z-50 border-b border-dashed border-gray-200/80 dark:border-gray-800/80 pt-1"
  >

    <UContainer class="flex items-center justify-between gap-3 h-16 py-2">
      <AppLogo class="lg:flex-1"/>
      <UPopover mode="hover">
        <UButton label="..." color="neutral" variant="subtle"/>
        <template #content>
          <div class="p-2">
            <UBreadcrumb :items="breadcrumbs" class="lg:flex-1"/>
          </div>
        </template>
      </UPopover>
      <UContainer class="max-w-7xl">
        <UNavigationMenu orientation="horizontal" :items="items" class="sm:hidden"/>
        <div class="hidden lg:block">
          <div class="align-top">
            <template v-for="item in items">
              <UButton :label="item.label" :to="item.to" :icon="item.icon" color="secondary" class="ml-1"
                       :variant="item.id !== firstRoute ? 'outline' : 'solid'"/>
            </template>
          </div>
          <div class="align-bottom">
            <template v-for="item in subMenu" :key="item.id">
              <UButton :label="item.label" :to="item.to" :icon="item.icon" color="info"
                       :variant="item.id !== secondRoute ? 'ghost' : 'soft'"/>
            </template>
          </div>

        </div>
      </UContainer>
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
