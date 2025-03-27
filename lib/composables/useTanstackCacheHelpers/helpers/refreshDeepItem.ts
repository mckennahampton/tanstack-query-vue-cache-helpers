import { ref, type Ref } from "vue"
import { nextTick } from "vue"
import { type IRefreshDeepItem } from "../types"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { findRecursive, updateDeepItem, insertDeepItem, refreshArray } from '../../../utilities/arrays/arrays'

export const refreshDeepItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    {
        item,
        childKey,
        parentKey,
        identityKey = 'id' as keyof T
    }: IRefreshDeepItem<T>
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                let temp = [...cacheArray!]
                const reactiveArrayCopy = ref<T[]>([]) as Ref<T[]>
                temp.forEach(item => reactiveArrayCopy.value.push(item))

                if (item[parentKey]) {   
                    let targetItem = findRecursive({
                        array: reactiveArrayCopy,
                        identityKey: identityKey,
                        target: item[identityKey],
                        childKey: childKey
                    })

                    if (targetItem) {
                        updateDeepItem({
                            array: reactiveArrayCopy,
                            item: item,
                            childKey: childKey,
                            parentKey: parentKey,
                            identityKey: identityKey
                        })
                    }
                    else {
                        insertDeepItem({
                            array: reactiveArrayCopy,
                            item: item,
                            childKey: childKey,
                            parentKey: parentKey,
                            identityKey: identityKey
                        })
                    }
                }
                // Item is root-level
                else {
                    refreshArray({ array: reactiveArrayCopy, newItems: [item] })
                }

                return reactiveArrayCopy.value
            }
        )
    }
    else {
        handleNotInitialized({
            call: 'refreshDeepItem',
            queryKey,
            item,
            childKey,
            parentKey
        }, queryKey)
    }

    await nextTick();
} 