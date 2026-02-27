<script setup lang="ts">
import * as z from 'zod'
import type {TableColumn} from "#ui/components/Table.vue";
import {ElementActive} from "#components";
import UDeleteEntityModal from "~/composables/UDeleteEntityModal.vue";
import {useDeleteEntity} from '~/composables/useDeleteEntity';
import type {FormSubmitEvent} from "#ui/types";
import {Schema} from "zod/v3";
definePageMeta({
  middleware: ['auth'],
});
useHead({
  title: "Текстовые параметры"
})
type Schema = z.output<typeof schema>
const auth = useAuthStore();
const {data, status, refresh: OnReloadParameters} = useHttp<any>("products/parameter");
const loading = computed(() => status.value === 'pending');
/*
watch(status, async (n, q) => {
  if (n === 'success') console.log(data.value)
})
*/

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


const schema = z.object({
  name: z.string('Поле обязательно'),
  slug: z.string('Ссылка обязательна'),
})

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
        },
        onFetchError({response}) {
          console.log(response)
        }
      }
  );
}
const formModal = useTemplateRef('formModal')

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (form.value.id === null) {
    createParameter()
  } else {
    updateParameter()
  }
}
const {showModal} = useDeleteEntity();
async function handleDelete(id: Number) {
  showModal(`products/parameter/${id}`).then(resolve => {
    OnReloadParameters()
  });

}
</script>

<template>
  <h1 class="mb-3 font-600 text-3xl">Параметры текстовые</h1>
  <div>
    <UButton label="Добавить параметр" color="secondary" @click="handleCreate"/>
  </div>
  <UTable :data="data" :columns="columns" class="flex-1" :disabled="loading"
          :loading="loading"
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
  <UModal v-model:open="showDialog" title="Текстовый параметр" :dismissible="false">
    <template #body>
      <UForm :schema="schema" :state="form" ref="formModal" @submit="onSubmit">
        <UFormField label="Параметр" name="name">
          <UInput v-model="form.name" class="w-full" placeholder="Название параметра"/>
        </UFormField>

        <UFormField label="Ссылка" name="slug">
          <UInput v-model="form.slug" class="w-full" placeholder="Ссылка параметра"/>
        </UFormField>
        <UFormField label="Описание">
          <UTextarea v-model="form.description" class="w-full" :rows="3"/>
        </UFormField>

          <UCheckbox v-model="form.is_category" label="Для категорий" name="is1"/>

        <UCheckbox v-model="form.is_group" label="Для групп"/>
        <UCheckbox v-model="form.is_product" label="Для товаров"/>

      </UForm>
    </template>
    <template #footer="{ close }">
      <UButton label="Отмена" color="neutral" variant="outline" @click="showDialog = false"/>
      <UButton v-if="form.id === null && auth.can('create product')"
               label="Добавить" color="secondary"
               @click="formModal.submit()"/>
      <UButton v-if="form.id !== null && auth.can('edit product')"
               label="Сохранить" color="secondary"
                @click="formModal.submit()"/>
    </template>
  </UModal>


  <UDeleteEntityModal name_entity="текстовый параметр">
    <p>
      При удалении параметра, на всех страницах исчезнут данные по нему.
    </p>
  </UDeleteEntityModal>
</template>

<style scoped>
.tdClass {
  padding: 2px;
}
</style>