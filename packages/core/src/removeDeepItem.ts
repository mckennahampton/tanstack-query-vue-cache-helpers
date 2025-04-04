import { type IRemoveDeepItem, IFrameworkAdapter } from "./types"
import { handleNotInitialized, isQueryInitialized } from "./utils"
import { removeDeepItem as removeDeepItemUtil } from './utilities/arrays/removeDeepItem'
import { type QueryKey, type QueryClient } from "@tanstack/query-core"

export const removeDeepItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    {
        targetKeyValue,
        childKey,
        parentKey,
        identityKey = 'id' as keyof T
    }: IRemoveDeepItem<T>,
    frameworkAdapter: IFrameworkAdapter
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                if (!cacheArray) return [];
                
                // Create a copy of the cache array to work with
                let arrayCopy = [...cacheArray];
                
                removeDeepItemUtil({
                    array: arrayCopy,
                    oldItem: targetKeyValue,
                    childKey: childKey,
                    parentKey: parentKey,
                    identityKey: identityKey
                });

                return arrayCopy;
            }
        );

        await frameworkAdapter.nextTick();
    }
    else {
        handleNotInitialized({
            call: 'removeDeepItem',
            queryKey,
            targetKeyValue,
            childKey,
            parentKey
        }, queryKey);
    }
} 