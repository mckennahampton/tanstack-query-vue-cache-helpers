import { type QueryKey, type QueryClient } from "@tanstack/react-query"
import { clearCache as coreClearCache } from "@tanstack-query-cache-helpers/core"
import { reactAdapter } from "./adapter"

export const clearCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey
) => {
    return coreClearCache<T>(queryClient, queryKey, reactAdapter)
} 