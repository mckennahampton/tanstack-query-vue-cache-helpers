import { type MaybeRef, unref, isRef } from 'vue'
import { refreshArray as coreRefreshArray } from '@tanstack-query-cache-helpers/core'

/**
 * @description
 * Vue-specific adapter for the refreshArray utility.
 * Handles Vue reactivity wrapping around the core array utility.
 * 
 * @param array 
 * @param newItems 
 * @param truncate 
 * @param identityKey 
 * @param newItemsLocation 
 * @returns
 */
interface VueRefreshArrayArgs<T> {
    array: MaybeRef<T[]>
    newItems: MaybeRef<T[]>
    truncate?: boolean
    identityKey?: keyof T
    newItemsLocation?: 'front' | 'back'
    debug?: boolean
}

export const refreshArray = <T>({
    array,
    newItems,
    truncate = false,
    identityKey = 'id' as keyof T,
    newItemsLocation = 'back',
    debug = false,
}: VueRefreshArrayArgs<T>): MaybeRef<T[]> => {
    // Handle Vue reactivity
    
    // If array is a ref, we need to update its value
    if (isRef(array)) {
        // Call the core implementation with unwrapped values
        const result = coreRefreshArray({
            array: unref(array),
            newItems: unref(newItems),
            truncate,
            identityKey,
            newItemsLocation,
            debug
        });
        
        // Update the ref value if needed
        if (result !== unref(array)) {
            array.value = result;
        }
        
        return array;
    } 
    // If array is not a ref, just call the core implementation
    else {
        return coreRefreshArray({
            array: unref(array),
            newItems: unref(newItems),
            truncate,
            identityKey,
            newItemsLocation,
            debug
        });
    }
}