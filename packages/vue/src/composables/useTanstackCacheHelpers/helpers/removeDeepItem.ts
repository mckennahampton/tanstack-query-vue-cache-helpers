import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { type IRemoveDeepItem } from "@tanstack-query-cache-helpers/core"
import { removeDeepItem as coreRemoveDeepItem } from "@tanstack-query-cache-helpers/core"
import { vueAdapter } from "./adapter"

export const removeDeepItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IRemoveDeepItem<T>
) => {
    return coreRemoveDeepItem(queryClient, queryKey, options, vueAdapter)
} 