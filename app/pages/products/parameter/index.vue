<script setup lang="ts">
import type {TableColumn} from "#ui/components/Table.vue";
import {ElementActive} from "#components";

definePageMeta({
  middleware: ['auth'],
});

const {data, status, refresh: OnReloadParameters} = useHttp<any>("products/parameter");
const loading = computed(() => status.value === 'pending');

watch(status, async (n, q) => {
  if (n === 'success') console.log(data.value)
})


const columns: TableColumn<any>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({row}) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'Название'
  },
  {
    accessorKey: 'slug',
    header: 'Ссылка'
  },
  {
    accessorKey: 'description',
    header: 'Описание'
  },
  {
    accessorKey: 'is_category',
    header: 'Для категорий',
    cell: ({row}) => {
      return h(ElementActive, {active: row.getValue('is_category')})
    }
  },
  {
    accessorKey: 'is_product',
    header: 'Для товаров',
    cell: ({row}) => {
      return h(ElementActive, {active: row.getValue('is_product')})
    }
  },
  {
    accessorKey: 'is_group',
    header: 'Для групп',
    cell: ({row}) => {
      return h(ElementActive, {active: row.getValue('is_group')})
    }
  },
  {
    id: 'action'
  }
]
const showDialog = ref(false)
const getInitialFormState = () => ({
  id: null,
  name: null,
  slug: null,
  description: null,
  is_category: false,
  is_group: false,
  is_product: false,
});

const form = ref(getInitialFormState())

function delParameter(id) {
  console.log("Удалить", id)
}
useHead({
  title: "Текстовые параметры"
})

function handleUpdate(row) {
  form.value = {...row.original}
  showDialog.value = true
}
function handleCreate() {
  form.value = getInitialFormState()
  showDialog.value = true
}
function updateParameter() {
  useHttp<any>(`products/parameter/${form.value.id}`, {
        method: "post",
        body: form.value,
        async onFetchResponse({response}) {
          await OnReloadParameters()
          showDialog.value = false
        }
      }
  );
}
function createParameter() {
  useHttp<any>("products/parameter", {
        method: "post",
        body: form.value,
        async onFetchResponse({response}) {
          await OnReloadParameters()
          showDialog.value = false
        }
      }
  );

}

</script>

<template>
  Параметры
  <div>
    <UButton label="Добавить параметр" color="secondary" @click="handleCreate"/>
  </div>

  <UTable :data="data" :columns="columns" class="flex-1" :disabled="loading">
    <template #action-cell="{ row }">
      <UButton @click="handleUpdate(row)"
               color="neutral"
               variant="ghost"
      >
        <UIcon name="i-lucide-pencil" class="text-green-600"/>
      </UButton>
      <UButton @click="delParameter(row.getValue('id'))"
               color="neutral"
               variant="ghost"
      >
        <UIcon name="i-lucide-trash" class="text-red-600"/>
      </UButton>
    </template>
  </UTable>


  <UModal v-model:open="showDialog" title="Текстовый параметр" :dismissible="false">
    <template #body>
      <UFormField label="Параметр">
        <UInput v-model="form.name" class="w-full" required placeholder="Название параметра"/>
      </UFormField>
      <UFormField label="Ссылка">
        <UInput v-model="form.slug" class="w-full" required placeholder="Ссылка параметра"/>
      </UFormField>
      <UFormField label="Описание">
        <UTextarea v-model="form.description" class="w-full" :rows="3"/>
      </UFormField>
      <UCheckbox v-model="form.is_category" label="Для категорий"/>
      <UCheckbox v-model="form.is_group" label="Для групп"/>
      <UCheckbox v-model="form.is_product" label="Для товаров"/>
    </template>
    <template #footer="{ close }">
      <UButton label="Отмена" color="neutral" variant="outline" @click="showDialog = false"/>
      <UButton v-if="form.id === null" label="Добавить" color="neutral" @click="createParameter"/>
      <UButton v-else label="Сохранить" color="neutral" @click="updateParameter"/>

    </template>
  </UModal>

</template>

<style scoped>

</style>