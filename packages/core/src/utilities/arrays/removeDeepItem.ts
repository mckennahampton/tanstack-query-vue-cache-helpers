import { removeArrayItem } from './removeArrayItem'
import { findRecursiveParent } from './findRecursiveParent'

const findArrayIndex = <T>(arr: T[], predicate: (item: T) => boolean): number => {
    for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i])) return i
    }
    return -1
}

export interface RemoveDeepItemArgs<T> {
    array: T[],
    oldItem: T | number,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T,
    findFn?: (item: T, target: any) => boolean
}

export const removeDeepItem = <T>({
    array,
    oldItem,
    childKey,
    parentKey,
    identityKey = 'id' as keyof T,
    findFn
}: RemoveDeepItemArgs<T>) => {

    // If the item provided is a number
    if (typeof oldItem == 'number')
    {
        // Determine if the item is root-level or nested in a parent
        let isRoot = array.some(item => item[identityKey] == oldItem)
        if (isRoot)
        {
            // No need to search recursively, just remove the item
            removeArrayItem({ 
                array: array, 
                identityValues: [oldItem], 
                identityKey: identityKey, 
                findFn: findFn ? (item) => findFn(item, oldItem) : undefined 
            })
        }

        // The target is nested somewhere
        else
        {
            let parent = findRecursiveParent({
                array: array, 
                identityKey: identityKey, 
                target: oldItem, 
                childKey: childKey,
                findFn: undefined  // Use standard key-based lookup for parent
            })
            if (parent)
            {
                // Remove the child with matching ID from the parent
                const children = parent[childKey] as T[]
                const index = findFn 
                    ? findArrayIndex(children, item => findFn(item, oldItem))
                    : findArrayIndex(children, item => item[identityKey] == oldItem)
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
                    array: array
                })
            }
        }
    }

    // Check if the item provided is an object with it's parent key
    else if (oldItem[parentKey])
    {
        const parent = findRecursiveParent({
            array: array,
            identityKey: identityKey,
            target: oldItem[identityKey],
            childKey: childKey,
            findFn: undefined  // Use standard key-based lookup for parent
        })

        if (parent) {
            const children = parent[childKey] as T[]
            const index = findFn 
                ? findArrayIndex(children, item => findFn(item, oldItem))
                : findArrayIndex(children, item => item[identityKey] == oldItem[identityKey])
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
                array: array
            })
        }
    }

    // Item is root-level
    else
    {
        removeArrayItem({ 
            array: array, 
            identityValues: [oldItem[identityKey]] as number[] | string[], 
            identityKey: identityKey,
            findFn: findFn ? (item) => findFn(item, oldItem) : undefined
        })
    }
}