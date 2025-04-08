import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { type IRemoveSubItem } from "@tanstack-query-cache-helpers/core"
import { removeSubItem as coreRemoveSubItem } from "../../../../../core/src/removeSubItem"
import { vueAdapter } from "./adapter"

export const removeSubItem = async <T extends object, U>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IRemoveSubItem<T, U>
) => {
    return coreRemoveSubItem(queryClient, queryKey, options, vueAdapter)
} 