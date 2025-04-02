import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { type IUpdateItem } from "@tanstack-query-cache-helpers/core"
import { updateItem as coreUpdateItem } from "@tanstack-query-cache-helpers/core"
import { vueAdapter } from "./adapter"

export const updateItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IUpdateItem<T>
) => {
    return coreUpdateItem(queryClient, queryKey, options, vueAdapter)
} 