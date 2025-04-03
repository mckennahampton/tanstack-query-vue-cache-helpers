import { type MaybeRef, unref } from 'vue'
import { updateDeepItem as coreUpdateDeepItem } from '@tanstack-query-cache-helpers/core'

interface VueUpdateDeepItemArgs<T> {
    array: MaybeRef<T[]>,
    item: T,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T
}

export const updateDeepItem = <T>({
    array,
    item,
    childKey,
    parentKey,
    identityKey = 'id' as keyof T
}: VueUpdateDeepItemArgs<T>) => {
    // Simply unwrap the reactive values and call the core implementation
    return coreUpdateDeepItem({
        array: unref(array),
        item,
        childKey,
        parentKey,
        identityKey
    });
}