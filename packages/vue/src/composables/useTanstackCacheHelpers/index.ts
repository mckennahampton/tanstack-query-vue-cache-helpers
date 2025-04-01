import { type QueryKey } from "@tanstack/vue-query"
import { useQueryClient } from "@tanstack/vue-query"
import { addToCache } from "./helpers/addToCache"
import { isQueryInitialized } from "./utils"

import type {
    IAddToCache,
    IUpdateItem,
    IRemoveItem,
    IRefreshCache,
    IRefreshDeepItem,
    IRemoveDeepItem,
    IRemoveSubItem,
    IRefreshPartialItem
} from "./types"

export const useTanstackCacheHelpers = <T extends object, TTaggedQueryKey extends QueryKey = QueryKey>(queryKey: TTaggedQueryKey) => {
    const queryClient = useQueryClient()

    return {
        queryClient,
        isQueryInitialized: () => isQueryInitialized(queryClient, queryKey),
        addToCache: (options: IAddToCache<T>) => addToCache(queryClient, queryKey, options),
    }
}
