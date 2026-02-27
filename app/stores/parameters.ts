import {defineStore} from 'pinia'
import type {Category} from "~/stores/categories";

export type TextParameter = {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_category: boolean;
    is_product: boolean;
    is_group: boolean;

}

export const useParametersStore = defineStore('parameters', () => {
    const toast = useToast();
    const {data: parameters, status, refresh} = useHttp<TextParameter[]>("products/parameter");
    const loading = computed(() => status.value === 'pending');
    async function reloadAndToast(status: number) {
        if (status === 200) {
            toast.add({ title: 'Обновление данных ...', icon: 'i-heroicons-arrow-path-solid', id: 'reloading', color: 'warning' });
            await refresh()
            toast.remove('reloading');
            toast.add({ title: 'Обновлено', icon: 'i-heroicons-check-circle-solid', color: 'success' });
        } else {
            toast.add({ title: `Ошибка действия ${status}`, icon: 'i-heroicons-x-circle-solid', color: 'error' });
        }
    }

    function findParameter(id: number) {
        return parameters.value.find(p => p.id === id)
    }

    function create(data: TextParameter) {
        toast.add({ title: 'Создание...', icon: 'i-heroicons-arrow-path-solid', id: 'creating', color: 'secondary' });
        useHttp<any>(`products/parameter`, {
            method: 'post',
            body: data,
            async onFetchResponse({response}) {
                toast.remove('creating');
                await reloadAndToast(response.status)
            }
        })
    }
    function remove(id: number)
    {
        toast.add({ title: 'Удаление...', icon: 'i-heroicons-arrow-path-solid', id: 'remove-loading' });
        useHttp<any>(`products/parameter/${id}`, {
            method: 'delete',
            async onFetchResponse({response}) {
                toast.remove('remove-loading');
                await reloadAndToast(response.status)
            }
        })
    }
    function update(id: number, data: TextParameter) {
        toast.add({ title: 'Сохранение...', icon: 'i-heroicons-arrow-path-solid', id: 'saving', color: 'secondary' });
        useHttp<any>(`products/parameter/${id}`, {
            method: 'post',
            body: data,
            async onFetchResponse({response}) {
                toast.remove('saving');
                await reloadAndToast(response.status)
            }
        })
    }
    return {
        parameters,
        loading,
        findParameter,
        create,
        update,
        remove
    }
})