import { type QueryKey } from "@tanstack/vue-query"

export const handleNotInitialized = (args: any, queryKey: QueryKey) => {
    console.debug(
        `Query with key ${JSON.stringify(queryKey)} is not initialized. Please ensure the query is initialized before attempting to modify the cache.`,
        args
    )
}

export const isQueryInitialized = (queryClient: any, queryKey: QueryKey) => {
    const data = queryClient.getQueryData(queryKey);
    return data !== undefined;
}