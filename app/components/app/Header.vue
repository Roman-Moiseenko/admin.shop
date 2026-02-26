<script lang="ts" setup>
const auth = useAuthStore();
const userItems = [
  [
    {
      slot: "overview",
    },
  ],
  [
    {
      label: "Account",
      to: "/account/general",
      icon: "i-heroicons-user",
    },
    {
      label: "Devices",
      to: "/account/devices",
      icon: "i-heroicons-device-phone-mobile",
    },
  ],
  [
    {
      label: "Sign out",
      onSelect() {
        auth.logout();
      },
      class: 'cursor-pointer',
      icon: "i-heroicons-arrow-left-on-rectangle",
    },
  ],
];

const items = [
  {
    label: 'Products',
    icon: 'i-lucide-package',
    active: true,
    children: [
      {
        label: 'Товары',
        description: 'Номенклатура товаров магазина',
        icon: 'i-lucide-package-open',
        to: "/products/product",
      },
      {
        label: 'Категории',
        description: 'Каталог всех категорий',
        icon: 'i-lucide-folder-tree',
        to: "/products/category",
      },

      {
        label: 'Атрибуты',
        description: 'Атрибуты категорий',
        icon: 'i-lucide-combine',
        to: "/products/attribute",
      },
      {
        label: 'Метки',
        description: 'Список тегов (меток) товаров',
        icon: 'i-lucide-tags',
        to: "/products/tag",
      },
      {
        label: 'Бренды',
        description: 'Список брендов товаров',
        icon: 'i-lucide-copyright',
        to: "/products/brand",
      },
      {
        label: 'Параметры',
        description: 'Текстовые параметры для категорий, групп и товаров',
        icon: 'i-lucide-variable',
        to: "/products/parameter",
      },
    ],
    disabled: !auth.can('view product')
  },
  {
    label: "Sales",
    icon: 'i-lucide-coins',
    children: [
      {
        label: 'Orders',
        description: 'Текущие заказы',
        icon: 'i-lucide-shopping-cart',
        to: "/",
      },
      {
        label: 'Users',
        description: 'Клиенты магазина',
        icon: 'i-lucide-users',
        to: "/",
      },
      {
        label: 'Arhive',
        description: 'Архив заказов (выполненные или отмененные)',
        icon: 'i-lucide-archive',
        to: "/",
      },
    ],
    disabled: !auth.can('view order')
  },

  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    children: [
      {
        label: 'Common',
        //description: 'Текущие заказы',
        //  icon: 'i-lucide-shopping-cart',
        to: "/",
      },
      {
        label: 'Website',
        //description: 'Текущие заказы',
        //  icon: 'i-lucide-shopping-cart',
        to: "/",
      },
      {
        label: 'Email',
        //description: 'Текущие заказы',
        //  icon: 'i-lucide-shopping-cart',
        to: "/",
      },
      {
        label: 'Images',
        //description: 'Текущие заказы',
        //  icon: 'i-lucide-shopping-cart',
        to: "/",
      },
      {
        label: 'Guide',
        //description: 'Текущие заказы',
        //  icon: 'i-lucide-shopping-cart',
        to: "/",
      },
    ],
    disabled: !auth.can('view settings')
  },
  {
    label: 'WebSite',
    icon: 'i-lucide-globe',
    children: [
      {
        label: 'Pages',
        //description: 'Текущие заказы',
        //  icon: 'i-lucide-shopping-cart',
        to: "/",
      },
      {
        label: 'Menu',
        //description: 'Текущие заказы',
        //  icon: 'i-lucide-shopping-cart',
        to: "/",
      },
    ],
    disabled: !auth.can('view web')
  },

  {
    label: 'Feedback',
    icon: 'i-lucide-messages-square',

    children: [
      {
        label: 'Email',
        icon: 'i-lucide-mail',
      },

    ],
    disabled: !auth.can('view feed')
  },

  {
    label: 'Help',
    icon: 'i-lucide-circle-help',
    disabled: true
  }
]

const isSideOpen = ref(false);


</script>
<template>
  <header
      class="bg-background/75 backdrop-blur -mb-px sticky top-0 z-50 border-b border-dashed border-gray-200/80 dark:border-gray-800/80"
  >
    <UContainer class="flex items-center justify-between gap-3 h-16 py-2">
      <AppLogo class="lg:flex-1"/>

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
