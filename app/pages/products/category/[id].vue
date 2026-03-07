<script setup lang="ts">
import {useCategoryStore} from "~/stores/products/category";
import * as z from 'zod'
import type {BreadcrumbItem} from "#ui/components/Breadcrumb.vue";
import type {TabsItem} from "#ui/components/Tabs.vue";
import {computed, reactive, watch} from "vue";
import {type CategoryInfo, useCategory} from "../../../composables/useCategory";


const route = useRoute()
const router = useRouter()

const storeCategory = useCategoryStore()
const pageData = useCategory(Number(route.params.id));
const category = pageData.category;
//console.log('category', category.value)
//type Schema = z.output<typeof pageData.schemaValidate>
const form = reactive<CategoryInfo>(pageData.getInitialFormState())

const lock = useLockStore()
//const items = ref<any[]>([])
const lockAcquired = ref(false)
const tabs: TabsItem[] = [
  {
    label: 'Подкатегории',
    icon: 'i-lucide-user',
    value: 'children',
    slot: 'children' as const
  },
  {
    label: 'Атрибуты',
    icon: 'i-lucide-lock',
    value: 'attributes',
    slot: 'attributes' as const
  },
  {
    label: 'Товары',
    icon: 'i-lucide-lock',
    value: 'products',
    slot: 'products' as const
  }
]
const activeTab = computed({
  get() {
    return (route.query.tab as string) || 'children'
  },
  set(tab) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.push({
      //   path: '/docs/components/tabs',
      query: {tab},
      //   hash: '#with-route-query'
    })
  }
})
watch(() => pageData.category, (newProduct, oldValue) => {
  console.log(newProduct)

  category.value = {...newProduct}
  Object.assign(form, newProduct)

  if (oldValue === null) {
    lock.acquireLock('category', category.value.id).then(result => {
      lockAcquired.value = result
      if (result) lock.startHeartbeat();
    });
  }
}, {immediate: true});

/*
onMounted(async () => {
 // category.value = null;
 // storeCategory.loadPage(Number(route.params.id))
})
*/
onBeforeUnmount(() => {
  lock.releaseLock()
})
</script>

<template>
  <AppPageWithLoader v-model="category">
    <AppTitle :name="category.name"/>
    <div class="rounded-mb p-2">
      <UForm :schema="pageData.schemaValidate" :state="form">
        {{ category }}
      </UForm>
    </div>
    <UTabs v-model="activeTab" :items="tabs" class="w-full" variant="link">
      <template #children="{ item }">
        <ProductCategoryTabChildren :children="pageData.children"/>
      </template>
      <template #attributes="{ item }">
        <ProductCategoryTabAttributes/>
      </template>
      <template #products="{ item }">
        <ProductCategoryTabProducts/>
      </template>

    </UTabs>
  </AppPageWithLoader>
</template>

<style scoped>

</style>