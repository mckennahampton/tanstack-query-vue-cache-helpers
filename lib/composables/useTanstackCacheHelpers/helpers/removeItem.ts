import { nextTick } from "vue"
import { type IRemoveItem } from "../types"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"

export const removeItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    { target, identityKey = 'id' as keyof T }: IRemoveItem<T>
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                return cacheArray!.filter(item => {
                    if (Array.isArray(target)) {
                        return !(target as Array<T[typeof identityKey]>).includes(item[identityKey] as T[typeof identityKey]);
                    }
                    return item[identityKey] !== target
                })
            }
        )

        await nextTick();
    }
    else {
        handleNotInitialized({
            call: 'removeFromCache',
            queryKey,
            target
        }, queryKey)
    }
} 