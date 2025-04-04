import { type IRefreshDeepItem, IFrameworkAdapter } from "./types"
import { handleNotInitialized, isQueryInitialized } from "./utils"
import { findRecursive, updateDeepItem, insertDeepItem, refreshArray } from './utilities/arrays/arrays'
import { type QueryKey, type QueryClient } from "@tanstack/query-core"

export const refreshDeepItem = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    {
        item,
        childKey,
        parentKey,
        identityKey = 'id' as keyof T
    }: IRefreshDeepItem<T>,
    frameworkAdapter: IFrameworkAdapter
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                if (!cacheArray) return [];
                
                // Create a copy of the cache array to work with
                let arrayCopy = [...cacheArray];
                
                if (item[parentKey]) {   
                    let targetItem = findRecursive({
                        array: arrayCopy,
                        identityKey: identityKey,
                        target: item[identityKey],
                        childKey: childKey
                    });

                    if (targetItem) {
                        updateDeepItem({
                            array: arrayCopy,
                            item: item,
                            childKey: childKey,
                            parentKey: parentKey,
                            identityKey: identityKey
                        });
                    }
                    else {
                        insertDeepItem({
                            array: arrayCopy,
                            item: item,
                            childKey: childKey,
                            parentKey: parentKey,
                            identityKey: identityKey
                        });
                    }
                }
                // Item is root-level
                else {
                    refreshArray({ 
                        array: arrayCopy, 
                        newItems: [item] 
                    });
                }

                return arrayCopy;
            }
        );

        await frameworkAdapter.nextTick();
    }
    else {
        handleNotInitialized({
            call: 'refreshDeepItem',
            queryKey,
            item,
            childKey,
            parentKey
        }, queryKey);
    }
} 