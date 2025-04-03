import { type MaybeRef, unref, isRef } from 'vue'
import { removeArrayItem as coreRemoveArrayItem } from '@tanstack-query-cache-helpers/core'

export interface VueRemoveArrayItemArgs<T> {
    array: MaybeRef<T[]>,
    identityValues: number[] | string[],
    identityKey?: keyof T
}
export const removeArrayItem = <T>({
    array,
    identityValues,
    identityKey ='id' as keyof T
}: VueRemoveArrayItemArgs<T>): MaybeRef<T[]> =>
{
    // If array is a ref, we need to use its value
    if (isRef(array)) {
        coreRemoveArrayItem({
            array: array.value,
            identityValues,
            identityKey
        });
        return array;
    } 
    // If array is not a ref, just call the core implementation
    else {
        return coreRemoveArrayItem({
            array: unref(array),
            identityValues,
            identityKey
        });
    }
}