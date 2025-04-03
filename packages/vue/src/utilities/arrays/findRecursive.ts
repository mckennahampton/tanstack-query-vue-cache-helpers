import { type MaybeRef, unref } from 'vue'
import { findRecursive as coreFindRecursive } from '@tanstack-query-cache-helpers/core'

/**
 * Vue-specific adapter for the findRecursive utility.
 * Handles Vue reactivity wrapping around the core array utility.
 *
 * @template T - The type of objects in the array.
 * @template U - The type of the target value.
 * @param {MaybeRef<T[]>} arr - The reactive array to search in.
 * @param {keyof T} targetKey - The key of the property to search for in each object.
 * @param {U} targetValue - The value to search for.
 * @param {keyof T} childKey - The key of the property that holds the child objects.
 * @return {T | null} The object with the target value, or null if not found.
 */

interface VueFindRecursiveArgs<T, U> {
    array: MaybeRef<T[]>,
    identityKey: keyof T,
    target: U,
    childKey: keyof T
}

export function findRecursive<T, U>({
    array,
    identityKey = 'id' as keyof T,
    target,
    childKey
}: VueFindRecursiveArgs<T, U>): T | null {
    // Simply unwrap the reactive values and call the core implementation
    return coreFindRecursive({
        array: unref(array),
        identityKey,
        target,
        childKey
    });
}