import { type QueryKey, type QueryClient } from "@tanstack/query-core"
import { handleNotInitialized, isQueryInitialized } from "./utils"
import { type IFrameworkAdapter } from "./types"

export const clearCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey,
    frameworkAdapter: IFrameworkAdapter
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            []
        )

        await frameworkAdapter.nextTick();
    }
    else {
        handleNotInitialized({
            call: 'clearCache',
            queryKey
        }, queryKey)
    }
} 