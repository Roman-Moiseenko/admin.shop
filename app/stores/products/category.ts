import {defineStore} from 'pinia'
import {useHttp} from "~/composables/useHttp";
import type {LockStatus} from "~/stores/lock";

export const useCategoryStore = defineStore('category', () => {

    const category = ref<any>({})
    const toast = useToast()

    async function loadCategory(id: number) {

        const {data, error, execute} = await useHttp<any>(`products/category/${id}`, {
            immediate: false,
            watch: false,
        });
        await execute();
        if (error.value) {
            toast.add({ title: String(error.value), icon: 'i-heroicons-x-circle-solid', color: 'error' });
             return false;
        }
        category.value = data.value
        return true

    }
    return {
        category,
        loadCategory
    }

})