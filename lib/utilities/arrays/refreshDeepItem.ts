import { type MaybeRef, unref } from 'vue'
import { refreshArray } from './refreshArray'
import { findRecursive } from './findRecursive'
import { updateDeepItem } from './updateDeepItem'
import { insertDeepItem } from './insertDeepItem'


interface RefreshDeepItemArgs<T> {
    array: MaybeRef<T[]>,
    newItem: T,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T
}

export const refreshDeepItem = <T>({
    array,
    newItem,
    childKey,
    parentKey,
    identityKey = 'id' as keyof T
}: RefreshDeepItemArgs<T>) => {

    if (unref(newItem)[parentKey])
    {
        if (findRecursive({array : array, identityKey : identityKey, target : unref(newItem), childKey: childKey}))
        {
            updateDeepItem({
                array: array,
                item: unref(newItem),
                childKey: childKey,
                parentKey: parentKey,
                identityKey: identityKey
            })    
        }

        else
        {
            insertDeepItem({
                array: array,
                item: unref(newItem),
                childKey: childKey,
                parentKey: parentKey,
                identityKey: identityKey
            })
        }
    }

    // Item is root-level
    else
    {
        refreshArray({ array: array, newItems: [newItem]})
    }
}