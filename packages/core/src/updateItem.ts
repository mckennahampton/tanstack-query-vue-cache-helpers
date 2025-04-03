import { type QueryKey, type QueryClient } from "@tanstack/query-core"
import { type IUpdateItem, type IFrameworkAdapter } from "./types"
import { handleNotInitialized, isQueryInitialized } from "./utils"

export const updateItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    { item, identityKey }: IUpdateItem<T>,
    frameworkAdapter: IFrameworkAdapter
) => {
    // Add the new item to the cache
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData(
            queryKey,
            (array: T[]) => array.map(_item => _item[identityKey] === item[identityKey] ? item : _item)
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