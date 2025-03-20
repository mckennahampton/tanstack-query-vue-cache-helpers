import { type MaybeRef, unref, isRef } from 'vue'

export interface RemoveArrayItemArgs<T> {
    array: MaybeRef<T[]>,
    identityValues: number[] | string[],
    identityKey?: keyof T
}
export const removeArrayItem = <T>({
    array,
    identityValues,
    identityKey ='id' as keyof T
}: RemoveArrayItemArgs<T>): MaybeRef<T[]> =>
{

    let index = unref(array).findIndex(item => identityValues.some(id => id == item[identityKey]))

    if (index != -1)
    {
        if (isRef(array)) array.value.splice(index, 1)
        else array.splice(index, 1)
    }

    return array
}