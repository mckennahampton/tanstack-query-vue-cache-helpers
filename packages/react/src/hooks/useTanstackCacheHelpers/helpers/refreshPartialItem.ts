import { type QueryKey, type QueryClient } from "@tanstack/react-query"
import { type IRefreshPartialItem } from "@tanstack-query-cache-helpers/core"
import { refreshPartialItem as coreRefreshPartialItem } from "@tanstack-query-cache-helpers/core"
import { reactAdapter } from "./adapter"

export const refreshPartialItem = async <T extends object, U>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    options: IRefreshPartialItem<T, U>
) => {
    return coreRefreshPartialItem(queryClient, queryKey, options, reactAdapter)
} 