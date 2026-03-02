import { defineStore } from 'pinia'

export type MenuItem = {
    id: string;
    label: string;
    icon: string;
    active: boolean;
    to: string;
    children: MenuItem[];
    disabled: boolean;
    description: string;

}

export const useMenuStore = defineStore('menu', () => {

    const auth = useAuthStore()
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

    const items = <MenuItem[]>[
        {
            id: 'products',
            label: 'Products',
            icon: 'i-lucide-package',
            //active: true,
            to: "/products",
            children: [
                {
                    id: 'product',
                    label: 'Товары',
                    description: 'Номенклатура товаров магазина',
                    icon: 'i-lucide-package-open',
                    to: "/products/product",
                },
                {
                    id: 'category',
                    label: 'Категории',
                    description: 'Каталог всех категорий',
                    icon: 'i-lucide-folder-tree',
                    to: "/products/category",
                },

                {
                    id: 'attribute',
                    label: 'Атрибуты',
                    description: 'Атрибуты категорий',
                    icon: 'i-lucide-combine',
                    to: "/products/attribute",
                },
                {
                    id: 'tag',
                    label: 'Метки',
                    description: 'Список тегов (меток) товаров',
                    icon: 'i-lucide-tags',
                    to: "/products/tag",
                },
                {
                    id: 'brand',
                    label: 'Бренды',
                    description: 'Список брендов товаров',
                    icon: 'i-lucide-copyright',
                    to: "/products/brand",
                },
                {
                    id: 'parameter',
                    label: 'Параметры',
                    description: 'Текстовые параметры для категорий, групп и товаров',
                    icon: 'i-lucide-variable',
                    to: "/products/parameter",
                },
            ],
            disabled: !auth.can('view product')
        },
        {
            id: 'sales',
            label: "Sales",
            icon: 'i-lucide-coins',
            to: '/sales',
            children: [
                {
                    id: 'order',
                    label: 'Orders',
                    description: 'Текущие заказы',
                    icon: 'i-lucide-shopping-cart',
                    to: "/",
                },
                {
                    id: 'client',
                    label: 'Clients',
                    description: 'Клиенты магазина',
                    icon: 'i-lucide-users',
                    to: "/",
                },
                {
                    id: 'arhive',
                    label: 'Arhive',
                    description: 'Архив заказов (выполненные или отмененные)',
                    icon: 'i-lucide-archive',
                    to: "/",
                },
            ],
            disabled: !auth.can('view order')
        },

        {
            id: 'settings',
            label: 'Settings',
            icon: 'i-lucide-settings',
            children: [
                {
                    id: 'common',
                    label: 'Common',
                    //description: 'Текущие заказы',
                    //  icon: 'i-lucide-shopping-cart',
                    to: "/",
                },
                {
                    id: 'website',
                    label: 'Website',
                    //description: 'Текущие заказы',
                    //  icon: 'i-lucide-shopping-cart',
                    to: "/",
                },
                {
                    id: 'email',
                    label: 'Email',
                    //description: 'Текущие заказы',
                    //  icon: 'i-lucide-shopping-cart',
                    to: "/",
                },
                {
                    id: 'image',
                    label: 'Images',
                    //description: 'Текущие заказы',
                    //  icon: 'i-lucide-shopping-cart',
                    to: "/",
                },
                {
                    id: 'guide',
                    label: 'Guide',
                    //description: 'Текущие заказы',
                    //  icon: 'i-lucide-shopping-cart',
                    to: "/",
                },
            ],
            disabled: !auth.can('view settings')
        },
        {
            id: 'website',
            label: 'WebSite',
            icon: 'i-lucide-globe',
            children: [
                {
                    id: 'page',
                    label: 'Pages',
                    //description: 'Текущие заказы',
                    //  icon: 'i-lucide-shopping-cart',
                    to: "/",
                },
                {
                    id: 'menu',
                    label: 'Menu',
                    //description: 'Текущие заказы',
                    //  icon: 'i-lucide-shopping-cart',
                    to: "/",
                },
            ],
            disabled: !auth.can('view web')
        },

        {
            id: 'feedback',
            label: 'Feedback',
            icon: 'i-lucide-messages-square',

            children: [
                {
                    id: 'email',
                    label: 'Email',
                    icon: 'i-lucide-mail',
                },

            ],
            disabled: !auth.can('view feed')
        },

        {
            id: 'help',
            label: 'Help',
            icon: 'i-lucide-circle-help',
            disabled: true
        }
    ]

    function getItem(id: string) {
        for(let i = 0; i < items.length; i++) {
            if (items[i].id === id) return items[i];
        }
        return undefined
    }
    function rootItems() {

        for (let i= 0; i < items.length; i++) {

        }
    }
    return {
        items,
        getItem,
        userItems
    }
})