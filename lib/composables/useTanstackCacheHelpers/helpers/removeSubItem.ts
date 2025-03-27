import { nextTick } from "vue"
import { type IRemoveSubItem } from "../types"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"
import { removeArrayItem } from '../../../utilities/arrays/arrays'

export const removeSubItem = async <T extends object, U>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    {
        identityKey = 'id' as keyof T,
        targetKeyValue,
        subItemsKey,
        removalKey = 'id' as keyof U,
        removalKeyValue
    }: IRemoveSubItem<T, U>
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                let temp = [...cacheArray!]
                // Create a shallow copy of the cache array
                const newCacheArray = temp.map(item => ({ ...item }));
                const target = newCacheArray.find(
                    item => JSON.stringify(item[identityKey]) === JSON.stringify(targetKeyValue)
                );

                if (target) {
                    // If the primary item has an array of sub-items, remove the target sub-item from the array
                    if (Array.isArray(target[subItemsKey])) {
                        // Create a shallow copy of the target's array
                        const newSubArray = [...target[subItemsKey]];

                        // Remove the target sub-item from the sub-items array
                        removeArrayItem<U>({
                            array: newSubArray,
                            identityValues: [removalKeyValue as number],
                            identityKey: removalKey
                        })

                        // Update the target sub-items array
                        target[subItemsKey] = newSubArray as T[keyof T];
                    }
                    else {
                        // If the primary item is a single sub-item, nullify the target sub-item
                        target[subItemsKey] = null as T[keyof T];
                    }
                }

                // Return the update local reactive copy of the cache
                return newCacheArray
            }
        )
    }
    else {
        handleNotInitialized({
            call: 'removeSubItem',
            queryKey,
            targetKeyValue,
            subItemsKey,
            removalKeyValue
        }, queryKey)
    }

    await nextTick();
} 