import { type MaybeRef, unref } from 'vue'
import { insertDeepItem as coreInsertDeepItem } from '@tanstack-query-cache-helpers/core'

interface VueInsertDeepItemArgs<T> {
    array: MaybeRef<T[]>,
    item: T,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T
}

export const insertDeepItem = <T>({
    array,
    item,
    childKey,
    parentKey,
    identityKey = 'id' as keyof T
}: VueInsertDeepItemArgs<T>) => {
    // Simply unwrap the reactive values and call the core implementation
    return coreInsertDeepItem({
        array: unref(array),
        item,
        childKey,
        parentKey,
        identityKey
    });
}