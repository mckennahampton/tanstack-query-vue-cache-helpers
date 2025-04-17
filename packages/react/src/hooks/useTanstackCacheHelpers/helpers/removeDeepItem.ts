import { type QueryKey, type QueryClient } from "@tanstack/react-query"
import { type IRemoveDeepItem } from "@tanstack-query-cache-helpers/core"
import { removeDeepItem as coreRemoveDeepItem } from "@tanstack-query-cache-helpers/core"
import { reactAdapter } from "./adapter"

export const removeDeepItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IRemoveDeepItem<T>
) => {
    return coreRemoveDeepItem(queryClient, queryKey, options, reactAdapter)
} 