import { type QueryKey, type QueryClient } from "@tanstack/query-core"
import { type IAddToCache, type IFrameworkAdapter } from "./types"
import { handleNotInitialized, isQueryInitialized } from "./utils"

export const addToCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    { item, placement = 'start' }: IAddToCache<T>,
    frameworkAdapter: IFrameworkAdapter
) => {
    // Add the new item to the cache
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => placement == 'start' ? [item, ...cacheArray!] : [...cacheArray!, item]
        )

        await frameworkAdapter.nextTick();
    }
    else {
        handleNotInitialized({
            call: 'addToCache',
            queryKey,
            item
        }, queryKey)
    }
} 