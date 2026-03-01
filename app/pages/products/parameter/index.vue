<script setup lang="ts">
import type {TableColumn} from "#ui/components/Table.vue";
import {ElementActive} from "#components";
import {type TextParameter, useParametersStore} from "~/stores/products/parameters";
definePageMeta({
  middleware: ['auth'],
});
useHead({
  title: "Текстовые параметры"
})

const auth = useAuthStore();
const storeParameters = useParametersStore()
const columns: TableColumn<TextParameter>[] = [
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
      return h(ElementActive, {active: Boolean(row.getValue('is_category'))})
    }
  },
  {
    accessorKey: 'is_product',
    header: 'Для товаров',
    cell: ({row}) => {
      return h(ElementActive, {active: Boolean(row.getValue('is_product'))})
    }
  },
  {
    accessorKey: 'is_group',
    header: 'Для групп',
    cell: ({row}) => {
      return h(ElementActive, {active: Boolean(row.getValue('is_group'))})
    }
  },
  {
    id: 'action'
  }
]

const showDelete = ref(false)
const id_delete = ref(0)

const modalUpdate = useTemplateRef('parameter-update')
const modalCreate = useTemplateRef('parameter-create')
function handleUpdate(row) {
  modalUpdate.value.showEdit({...row.original})
}

function handleCreate() {
  modalCreate.value.showEdit()
}

function deleteParameter(v: boolean) {
  if (v) storeParameters.remove(id_delete.value)
  showDelete.value = false;
  id_delete.value = 0;
}

function handleDelete(id: number) {
  showDelete.value = true
  id_delete.value = id;
}
</script>

<template>
  <AppTitle icon="i-lucide-variable" name="Параметры текстовые" />

  <div>
    <UButton label="Добавить параметр" color="secondary" @click="handleCreate"/>
  </div>
  <UTable :data="storeParameters.parameters" :columns="columns" class="flex-1" :disabled="storeParameters.loading"
          :loading="storeParameters.loading"
          loading-color="primary"
          loading-animation="carousel"
          :ui="{
            td: 'p-2 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0'
          }"
  >
    <template #action-cell="{ row }">
      <UButton @click="handleUpdate(row)"
               color="neutral"
               variant="ghost"
      >
        <UIcon name="i-lucide-pencil" class="text-green-600"/>
      </UButton>
      <UButton @click="handleDelete(row.getValue('id'))" v-if="auth.can('delete product')"
               color="neutral"
               variant="ghost"
      >
        <UIcon name="i-lucide-trash" class="text-red-600"/>
      </UButton>
    </template>
  </UTable>

  <ProductParameterCreate ref="parameter-create" />
  <ProductParameterUpdate ref="parameter-update" />

  <ElementDeleteModal v-model="showDelete" name="категорию" @confirmation="deleteParameter" >
    <template #body>
      При удалении параметра, на всех страницах исчезнут данные по нему.
    </template>
  </ElementDeleteModal>
</template>

<style scoped>
.tdClass {
  padding: 2px;
}
</style>