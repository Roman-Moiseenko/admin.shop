import {defineStore} from 'pinia'
import {useHttp} from "~/composables/useHttp";
import type {LockStatus} from "~/stores/lock";

export const useCategoryStore = defineStore('category', () => {

    const category = ref<any>({})
    const children = ref<any>([])
    const attributes = ref<any>({})
    const products = ref<any>([])
    const toast = useToast()



    function loadPage(id: number)
    {
        useHttp<any>(`products/category/${id}`, {
            onFetchResponse({response}) {
                if (response.status === 200) category.value = response._data;
            }
        });
        useHttp<any>(`products/category/children/${id}`, {
            onFetchResponse({response}) {
                if (response.status === 200) children.value = response._data;
            }
        });
        useHttp<any>(`products/category/attributes/${id}`, {
            onFetchResponse({response}) {
                if (response.status === 200) attributes.value = response._data;
            }
        });
        useHttp<any>(`products/category/products/${id}`, {
            onFetchResponse({response}) {
                if (response.status === 200) products.value = response._data;
            }
        });

    }

    async function loadCategory(id: number) {

        const {data, error, execute, refresh: refreshCategory} = await useHttp<any>(`products/category/${id}`, {
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
        children,
        attributes,
        products,
        loadPage,

        //refreshCategory

     //   loadCategory
    }

})