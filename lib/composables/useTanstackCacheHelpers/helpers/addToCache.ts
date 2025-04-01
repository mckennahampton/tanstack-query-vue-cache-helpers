import { type IAddToCache } from "../types"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { addToCache as coreAddToCache } from "../../../core/addToCache"
import { vueAdapter } from "../../../adapters/vue"

export const addToCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IAddToCache<T>
) => {
    return coreAddToCache(queryClient, queryKey, options, vueAdapter)
}