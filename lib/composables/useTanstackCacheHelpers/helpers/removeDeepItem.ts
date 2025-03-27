import { ref, type Ref } from "vue"
import { nextTick } from "vue"
import { type IRemoveDeepItem } from "../types"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { removeDeepItem as removeDeepItemUtil } from '../../../utilities/arrays/arrays'

export const removeDeepItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    {
        targetKeyValue,
        childKey,
        parentKey,
        identityKey = 'id' as keyof T
    }: IRemoveDeepItem<T>
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                let temp = [...cacheArray!]
                const reactiveArrayCopy = ref<T[]>([]) as Ref<T[]>
                temp.forEach(item => reactiveArrayCopy.value.push(item))

                removeDeepItemUtil({
                    array: reactiveArrayCopy,
                    oldItem: targetKeyValue,
                    childKey: childKey,
                    parentKey: parentKey,
                    identityKey: identityKey
                })

                return reactiveArrayCopy.value
            }
        )
    }
    else {
        handleNotInitialized({
            call: 'removeDeepItem',
            queryKey,
            targetKeyValue,
            childKey,
            parentKey
        }, queryKey)
    }

    await nextTick();
} 