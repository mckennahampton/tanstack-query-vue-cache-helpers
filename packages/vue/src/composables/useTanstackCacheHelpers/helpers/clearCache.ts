import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { clearCache as coreClearCache } from "@tanstack-query-cache-helpers/core"
import { vueAdapter } from "./adapter"

export const clearCache = async (
    queryClient: QueryClient, 
    queryKey: QueryKey, 
) => {
    return coreClearCache(queryClient, queryKey, vueAdapter)
} 