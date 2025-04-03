import { type QueryKey } from "@tanstack/vue-query"
import { useQueryClient } from "@tanstack/vue-query"
import { addToCache } from "./helpers/addToCache"
import { updateItem } from "./helpers/updateItem"
import { refreshCache } from "./helpers/refreshCache"
import { isQueryInitialized } from "@tanstack-query-cache-helpers/core"
import { clearCache } from "./helpers/clearCache"
import type {
    IAddToCache,
    IUpdateItem,
    IRefreshCache,
    // IRemoveItem,
    // IRefreshDeepItem,
    // IRemoveDeepItem,
    // IRemoveSubItem,
    // IRefreshPartialItem
} from "@tanstack-query-cache-helpers/core"

export const useTanstackCacheHelpers = <T extends object, TTaggedQueryKey extends QueryKey = QueryKey>(queryKey: TTaggedQueryKey) => {
    const queryClient = useQueryClient()

    return {
        queryClient,
        isQueryInitialized: () => isQueryInitialized(queryClient, queryKey),
        addToCache: (options: IAddToCache<T>) => addToCache(queryClient, queryKey, options),
        updateItem: (options: IUpdateItem<T>) => updateItem(queryClient, queryKey, options),
        clearCache: () => clearCache(queryClient, queryKey),
        refreshCache: (options: IRefreshCache<T>) => refreshCache(queryClient, queryKey, options),
    }
}
