import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { type IRefreshDeepItem } from "@tanstack-query-cache-helpers/core"
import { refreshDeepItem as coreRefreshDeepItem } from "@tanstack-query-cache-helpers/core"
import { vueAdapter } from "./adapter"

export const refreshDeepItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IRefreshDeepItem<T>
) => {
    return coreRefreshDeepItem(queryClient, queryKey, options, vueAdapter)
} 