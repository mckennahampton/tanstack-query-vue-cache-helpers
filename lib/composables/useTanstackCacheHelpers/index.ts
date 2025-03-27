import { type QueryKey } from "@tanstack/vue-query"
import { useQueryClient } from "@tanstack/vue-query"
import { addToCache } from "./helpers/addToCache"
import { updateItemInCache } from "./helpers/updateItemInTanstackCache"
import { removeFromCache } from "./helpers/removeFromCache"
import { clearCache } from "./helpers/clearCache"
import { refreshCache } from "./helpers/refreshCache"
import { refreshDeepItem } from "./helpers/refreshDeepItem"
import { removeDeepItem } from "./helpers/removeDeepItem"
import { refreshPartialItem } from "./helpers/refreshPartialItem"
import { removeSubItem } from "./helpers/removeSubItem"
import { isQueryInitialized } from "./utils"
import type {
    IAddToCache,
    IUpdateItemInCache,
    IRemoveFromCache,
    IRefreshCache,
    IRefreshDeepItem,
    IRemoveDeepItem,
    IRemoveSubItem,
    IRefreshPartialItem
} from "./types"

export const useTanstackQueryHelpers = <T extends object, TTaggedQueryKey extends QueryKey = QueryKey>(queryKey: TTaggedQueryKey) => {
    const queryClient = useQueryClient()

    return {
        queryClient,
        isQueryInitialized: () => isQueryInitialized(queryClient, queryKey),
        addToCache: (options: IAddToCache<T>) => addToCache(queryClient, queryKey, options),
        updateItemInCache: (options: IUpdateItemInCache<T>) => updateItemInCache(queryClient, queryKey, options),
        removeFromCache: (options: IRemoveFromCache<T>) => removeFromCache(queryClient, queryKey, options),
        clearCache: () => clearCache<T>(queryClient, queryKey),
        refreshCache: (options: IRefreshCache<T>) => refreshCache(queryClient, queryKey, options),
        refreshDeepItem: (options: IRefreshDeepItem<T>) => refreshDeepItem(queryClient, queryKey, options),
        removeDeepItem: (options: IRemoveDeepItem<T>) => removeDeepItem(queryClient, queryKey, options),
        refreshPartialItem: <U>(options: IRefreshPartialItem<T, U>) => refreshPartialItem(queryClient, queryKey, options),
        removeSubItem: <U>(options: IRemoveSubItem<T, U>) => removeSubItem(queryClient, queryKey, options)
    }
}
