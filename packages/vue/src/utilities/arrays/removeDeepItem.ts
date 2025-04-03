import { type MaybeRef, unref } from 'vue'
import { removeDeepItem as coreRemoveDeepItem } from '@tanstack-query-cache-helpers/core'

export interface VueRemoveDeepItemArgs<T> {
    array: MaybeRef<T[]>,
    oldItem: T | number,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T
}

export const removeDeepItem = <T>({
    array,
    oldItem,
    childKey,
    parentKey,
    identityKey = 'id' as keyof T
}: VueRemoveDeepItemArgs<T>) => {
    // Simply unwrap the reactive values and call the core implementation
    return coreRemoveDeepItem({
        array: unref(array),
        oldItem,
        childKey,
        parentKey,
        identityKey
    });
}