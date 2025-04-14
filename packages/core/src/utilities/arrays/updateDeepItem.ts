import { findRecursive } from './findRecursive'
import { removeDeepItem } from './removeDeepItem'
import { insertDeepItem } from './insertDeepItem'

interface UpdateDeepItemArgs<T> {
    array: T[],
    item: T,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T,
    findFn?: (item: T, target: any) => boolean
}

export const updateDeepItem = <T>({
    array,
    item,
    childKey,
    parentKey,
    identityKey = 'id' as keyof T,
    findFn
}: UpdateDeepItemArgs<T>) => {

    let target = findRecursive({ 
        array: array, 
        identityKey, 
        target: item[identityKey], 
        childKey: childKey,
        findFn: findFn ? (existingItem, targetValue) => findFn(existingItem, item) : undefined
    })
    
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
                identityKey: identityKey,
                findFn
            })

            // and add the new object to it's new parent
            insertDeepItem({
                array: array,
                item: item,
                childKey: childKey,
                parentKey: parentKey,
                identityKey: identityKey,
                findFn
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