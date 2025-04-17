import { type QueryKey, type QueryClient } from "@tanstack/react-query"
import { type IRemoveSubItem } from "@tanstack-query-cache-helpers/core"
import { removeSubItem as coreRemoveSubItem } from "@tanstack-query-cache-helpers/core"
import { reactAdapter } from "./adapter"

export const removeSubItem = async <T extends object, U>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IRemoveSubItem<T, U>
) => {
    return coreRemoveSubItem(queryClient, queryKey, options, reactAdapter)
} 