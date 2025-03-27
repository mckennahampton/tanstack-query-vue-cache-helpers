import { nextTick } from "vue"
import { type IAddToCache } from "../types"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"

export const addToCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    { item, placement = 'start' }: IAddToCache<T>
) => {
    // Add the new item to the cache
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => placement == 'start' ? [item, ...cacheArray!] : [...cacheArray!, item]
        )

        await nextTick();
    }
    else {
        handleNotInitialized({
            call: 'addToCache',
            queryKey,
            item
        }, queryKey)
    }
}