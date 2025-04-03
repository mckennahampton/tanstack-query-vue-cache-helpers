import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { type IRefreshCache } from "@tanstack-query-cache-helpers/core"
import { refreshCache as coreRefreshCache } from "@tanstack-query-cache-helpers/core"
import { vueAdapter } from "./adapter"

export const refreshCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IRefreshCache<T>
) => {
    return coreRefreshCache(queryClient, queryKey, options, vueAdapter)
} 