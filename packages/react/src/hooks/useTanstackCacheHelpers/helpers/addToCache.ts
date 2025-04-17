import { type QueryKey, type QueryClient } from "@tanstack/react-query"
import { type IAddToCache } from "@tanstack-query-cache-helpers/core"
import { addToCache as coreAddToCache } from "@tanstack-query-cache-helpers/core"
import { reactAdapter } from "./adapter"

export const addToCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IAddToCache<T>
) => {
    return coreAddToCache(queryClient, queryKey, options, reactAdapter)
} 