import { type MaybeRef, unref } from 'vue'
import { removeArrayItem } from './removeArrayItem'
import { findRecursiveParent } from './findRecursiveParent'

const findArrayIndex = <T>(arr: T[], predicate: (item: T) => boolean): number => {
    for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i])) return i
    }
    return -1
}

export interface RemoveDeepItemArgs<T> {
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
}: RemoveDeepItemArgs<T>) => {

    // If the item provided is a number
    if (typeof oldItem == 'number')
    {
        // Determine if the item is root-level or nested in a parent
        let isRoot = unref(array).some(item => item[identityKey] == oldItem)
        if (isRoot)
        {
            // No need to search recursively, just remove the item
            removeArrayItem({ array: unref(array), identityValues: [oldItem], identityKey: identityKey })
        }

        // The target is nested somewhere
        else
        {
            let parent = findRecursiveParent({array: array, identityKey: identityKey, target: oldItem, childKey: childKey})
            if (parent)
            {
                // Remove the child with matching ID from the parent
                const children = parent[childKey] as T[]
                const index = findArrayIndex(children, item => item[identityKey] == oldItem)
                if (index !== -1) children.splice(index, 1)
                return
            }
            else
            {
                console.error("Could not find parent item to remove nested item", {
                    result: parent,
                    oldItem: oldItem,
                    parentKey: parentKey,
                    childKey: childKey,
                    array: unref(array)
                })
            }
        }
    }

    // Check if the item provided is an object with it's parent key
    else if (oldItem[parentKey])
    {
        const parent = findRecursiveParent({
            array: unref(array),
            identityKey: identityKey,
            target: oldItem[identityKey],
            childKey: childKey
        })

        if (parent) {
            const children = parent[childKey] as T[]
            const index = findArrayIndex(children, item => item[identityKey] == oldItem[identityKey])
            if (index !== -1) {
                children.splice(index, 1)
            }
        }
        else
        {
            console.error("Could not find parent item to remove nested item", {
                result: parent,
                oldItem: oldItem,
                parentKey: parentKey,
                childKey: childKey,
                array: unref(array)
            })
        }
    }

    // Item is root-level
    else
    {
        removeArrayItem({ array: array, identityValues: [oldItem[identityKey]] as number[] | string[], identityKey: identityKey })
    }
}