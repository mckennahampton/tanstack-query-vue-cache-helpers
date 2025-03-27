import { nextTick } from "vue"
import { type IUpdateItem } from "../types"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"

export const updateItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    { item, identityKey = 'id' as keyof T }: IUpdateItem<T>
) => {
    // Add the new item to the cache
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                return cacheArray!.map(_item => _item[identityKey] === item[identityKey] ? item : _item)
            }
        )

        await nextTick();
    }
    else {
        handleNotInitialized({
            call: 'updateItemInCache',
            queryKey,
            item
        }, queryKey)
    }
}