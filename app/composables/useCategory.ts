import {useHttp} from "./useHttp";
import {watch} from "vue";
import * as z from "zod";

export type CategoryInfo = {
    id: number;
    parent_id: number;
    name: string;
    slug: string;
    svg: string;
    published: boolean;
    meta: {
      title: string;
      description: string;
        keywords: string;
    },
    parameters: Array<CategoryParameter>
}
export type CategoryParameter = {
    parameter_id: number;
    name: string;
    text: string;
}


export function useCategory(id: number) {

    console.log('useCategory', id)
    const {data: category, status: categoryStatus, refresh: categoryRefresh } = useHttp<CategoryInfo>(`products/category/${id}`)
    const {data: children, status: childrenStatus, refresh: childrenRefresh } = useHttp<any>(`products/category/children/${id}`)
    const {data: attributes, status: attributesStatus, refresh: attributesRefresh } = useHttp<any>(`products/category/attributes/${id}`)
    const {data: products, status: productsStatus, refresh: productsRefresh } = useHttp<any>(`products/category/products/${id}`)


    //TODO Функции по редактированию категории
    const getInitialFormState = () => (<CategoryInfo>{
        id: null,
        parent_id: null,
        name: null,
        slug: null,
        svg: null,
        published: null,
        meta: {
            title: null,
            description: null,
            keywords: null,
        },
        parameters: []
    });

    const schemaValidate = z.object({
        name: z.string('Поле обязательно'),
        slug: z.string('Ссылка обязательна'),
    })

    async function setInfo(info: CategoryInfo) {

        useHttp<any>(`products/category/children/${id}`, {
            method: "POST",
            body: JSON.stringify(info),
            onFetchResponse({response}) {
             //   if (response.status === 200) return true;
            }
        })
    }

    console.log(category.value)
    return {
        category,
        children,
        attributes,
        products,
        getInitialFormState,
        setInfo,
        schemaValidate
    }
}