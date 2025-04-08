import { type IRemoveItem, IFrameworkAdapter } from "./types"
import { handleNotInitialized, isQueryInitialized } from "./utils"
import { type QueryKey, type QueryClient } from "@tanstack/query-core"

export const removeItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    { target, identityKey = 'id' as keyof T }: IRemoveItem<T>,
    frameworkAdapter: IFrameworkAdapter
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                if (!cacheArray) return [];
                
                return cacheArray.filter(item => {
                    if (Array.isArray(target)) {
                        return !(target as Array<T[typeof identityKey]>).includes(item[identityKey] as T[typeof identityKey]);
                    }
                    return item[identityKey] !== target;
                });
            }
        );

        await frameworkAdapter.nextTick();
    }
    else {
        handleNotInitialized({
            call: 'removeItem',
            queryKey,
            target
        }, queryKey);
    }
} 