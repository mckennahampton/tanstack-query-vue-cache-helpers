import { nextTick } from "vue"
import { type IRefreshPartialItem } from "../types"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { refreshArray } from '../../../utilities/arrays/arrays'

export const refreshPartialItem = async <T extends object, U>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    {
        targetKeyValue,
        identityKey = 'id' as keyof T,
        updateKey,
        updatedContent,
        updatedItemsIdentityKey = 'id' as keyof U,
        treatArrayAsObject = false,
        debug = false
    }: IRefreshPartialItem<T, U>
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                // Create a shallow copy of the cache array
                let temp = [...cacheArray!]
                const newCacheArray = temp.map(item => ({ ...item }));
                const target = newCacheArray.find(
                    item => JSON.stringify(item[identityKey]) === JSON.stringify(targetKeyValue)
                );
        
                if (target) {
                    if (Array.isArray(target[updateKey]) && !treatArrayAsObject) {
                        // Create a shallow copy of the target's array
                        const newSubArray = [...target[updateKey]];
        
                        // Use your `refreshArray` method to modify the array
                        refreshArray<U>({
                            array: newSubArray,
                            newItems: Array.isArray(updatedContent) ? updatedContent : [updatedContent],
                            newItemsLocation: 'back',
                            identityKey: updatedItemsIdentityKey,
                        });
        
                        // Assign the new array back to the target
                        target[updateKey] = newSubArray as T[keyof T];
                    } else {
                        target[updateKey] = updatedContent as T[keyof T];
                    }
                }
                return newCacheArray
            }
        );
    }
    else {
        handleNotInitialized({
            call: 'refreshPartialItem',
            queryKey,
            targetKeyValue,
            updateKey,
            updatedContent
        }, queryKey)
    }

    await nextTick();
} 