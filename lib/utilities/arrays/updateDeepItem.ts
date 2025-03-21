import { type MaybeRef } from 'vue'
import { findRecursive } from './findRecursive'
import { removeDeepItem } from './removeDeepItem'
import { insertDeepItem } from './insertDeepItem'


interface UpdateDeepItemArgs<T> {
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
}: UpdateDeepItemArgs<T>) => {

    let target = findRecursive({ array: array, identityKey, target: item[identityKey], childKey: childKey})
    if (target)
    {
        // The item has potentially moved, so we need to handle that use-case
        if (target[parentKey] != item[parentKey])
        {

            // Simplest move is to just remove the old object from it's current parent...
            removeDeepItem({
                array: array,
                oldItem: target,
                childKey: childKey,
                parentKey: parentKey,
                identityKey: identityKey
            })

            // and add the new object to it's new parent
            insertDeepItem({
                array: array,
                item: item,
                childKey: childKey,
                parentKey: parentKey,
                identityKey: identityKey
            })
        }

        else
        {
            console.log('Updating item in-place', target, item)
            // Update the item in-place & retain reactivity
            Object.assign(target, item)
        }
    }
}