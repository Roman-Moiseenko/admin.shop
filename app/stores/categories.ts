import {defineStore} from 'pinia'

export type Category = {
    id: number;
    name: string;
    slug: string;
    image: string;
    icon: string;
    published: boolean;
    children: Category[];
}
export type CategoryCreate = {
    name: string;
    slug: string;
    parent_id: number,
}

export const useCategoriesStore = defineStore('categories', () => {

    const toast = useToast();
    const {
        data: categories,
        status: statusCategories,
        refresh: refreshCategories
    } = useHttp<Category[]>("products/category");
    const {data: list, status: statusList, refresh: refreshList} = useHttp<any>("products/category/list");

    async function reloadAndToast(status: number) {
        if (status === 200) {
            await reload()
        } else {
            toast.add({ title: `Ошибка действия ${status}`, icon: 'i-heroicons-x-circle-solid', color: 'error' });
        }
    }

    async function reload() {
        toast.add({ title: 'Обновление данных ...', icon: 'i-heroicons-arrow-path-solid', id: 'reloading', color: 'warning' });
        await refreshCategories()
        await refreshList()
        toast.remove('reloading');
        toast.add({ title: 'Обновлено', icon: 'i-heroicons-check-circle-solid', color: 'success' });
    }

    //Найти категорию в списке состояния
    function findCategory(id: number) {
        const cat = ref(<Category>{})
        if (statusCategories.value === 'success') cat.value = _findCategory(id, categories.value)
        watch(statusCategories, async (n, q) => {
            if (n === 'success') cat.value = _findCategory(id, categories.value)
        })
        return cat;
    }

    //Получить все данные по категории от сервера
    async function getCategory(id: number) {
        const cat = ref([])
        await useHttp<any>(`products/category/${id}`, {
            onFetchResponse: ({response}) => {
                console.log(response)
                if (response.status === 200) cat.value = response._data
            }
        });
        return cat
    }

    function _findCategory(id: number, listCategories: Category[]) {

        //TODO Слишком много рекусрии, переделать на линейный массив
        //console.log(id, listCategories)
        let index: number;
        for (index = 0; index < listCategories.length; ++index) {
            const category = listCategories[index];
            //console.log(id, category.id)
            if (category.id === id) return category;
           // console.log(id, category.children)
            //Ищем в дочерних
           if (category.children.length > 0) {
               const v = _findCategory(id, category.children)
               if (v !== null) return v;
           }
        }
        //console.log(id, 'null')
        return null;
    }

    function up(id: number) {
        toast.add({ title: 'Перемещение...', icon: 'i-heroicons-arrow-path-solid', id: 'up-loading', color: 'secondary' });
        useHttp<any>(`products/category/up/${id}`, {
            method: 'post',
            async onFetchResponse({response}) {
                toast.remove('up-loading');
                await reloadAndToast(response.status)
            }
        })
    }

    function down(id: number) {
        toast.add({ title: 'Перемещение...', icon: 'i-heroicons-arrow-path-solid', id: 'down-loading', color: 'secondary' });
        useHttp<any>(`products/category/down/${id}`, {
            method: 'post',
            async onFetchResponse({response}) {
                toast.remove('down-loading');
                await reloadAndToast(response.status)
            }
        })
    }

    function create(data: CategoryCreate) {
        toast.add({ title: 'Создание...', icon: 'i-heroicons-arrow-path-solid', id: 'creating', color: 'secondary' });
        useHttp<any>(`products/category`, {
            method: 'post',
            body: {
                name: data.name,
                parent_id: data.parent_id,
                slug: data.slug,
            },
            async onFetchResponse({response}) {
                toast.remove('creating');
                await reloadAndToast(response.status)
            }
        })
    }

    function remove(id: number)
    {
        toast.add({ title: 'Удаление...', icon: 'i-heroicons-arrow-path-solid', id: 'remove-loading' });
        useHttp<any>(`products/category/${id}`, {
            method: 'delete',
            async onFetchResponse({response}) {
                toast.remove('remove-loading');
                await reloadAndToast(response.status)
            }
        })
    }
    return {
        categories,
        list,
        //reload,
        findCategory,
        getCategory,

        up,
        down,
        create,
        remove
    }
})