import { type QueryKey } from "@tanstack/vue-query"
import { useQueryClient } from "@tanstack/vue-query"
import { addToCache } from "./helpers/addToCache"
import { updateItem } from "./helpers/updateItem"
import { refreshCache } from "./helpers/refreshCache"
import { refreshDeepItem } from "./helpers/refreshDeepItem"
import { removeDeepItem } from "./helpers/removeDeepItem"
import { refreshPartialItem } from "./helpers/refreshPartialItem"
import { isQueryInitialized } from "@tanstack-query-cache-helpers/core"
import { clearCache } from "./helpers/clearCache"
import type {
    IAddToCache,
    IUpdateItem,
    IRefreshCache,
    // IRemoveItem,
    IRefreshDeepItem,
    IRemoveDeepItem,
    // IRemoveSubItem,
    IRefreshPartialItem
} from "@tanstack-query-cache-helpers/core"

export const useTanstackCacheHelpers = <T extends object, U extends object = any, TTaggedQueryKey extends QueryKey = QueryKey>(queryKey: TTaggedQueryKey) => {
    const queryClient = useQueryClient()

    return {
        queryClient,
        isQueryInitialized: () => isQueryInitialized(queryClient, queryKey),
        addToCache: (options: IAddToCache<T>) => addToCache<T>(queryClient, queryKey, options),
        updateItem: (options: IUpdateItem<T>) => updateItem<T>(queryClient, queryKey, options),
        clearCache: () => clearCache(queryClient, queryKey),
        refreshCache: (options: IRefreshCache<T>) => refreshCache<T>(queryClient, queryKey, options),
        refreshDeepItem: (options: IRefreshDeepItem<T>) => refreshDeepItem<T>(queryClient, queryKey, options),
        refreshPartialItem: (options: IRefreshPartialItem<T, U>) => refreshPartialItem<T, U>(queryClient, queryKey, options),
        removeDeepItem: (options: IRemoveDeepItem<T>) => removeDeepItem<T>(queryClient, queryKey, options),
    }
}
