import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { type IRemoveItem } from "@tanstack-query-cache-helpers/core"
import { removeItem as coreRemoveItem } from "@tanstack-query-cache-helpers/core"
import { vueAdapter } from "./adapter"

export const removeItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IRemoveItem<T>
) => {
    return coreRemoveItem(queryClient, queryKey, options, vueAdapter)
} 