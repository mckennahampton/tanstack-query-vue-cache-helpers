import { nextTick } from "vue"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"

export const clearCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            []
        )

        await nextTick();
    }
    else {
        handleNotInitialized({
            call: 'clearCache',
            queryKey
        }, queryKey)
    }
} 