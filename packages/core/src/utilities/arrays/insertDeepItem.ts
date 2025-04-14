import { findRecursive } from './findRecursive'

interface InsertDeepItemArgs<T> {
    array: T[],
    item: T,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T,
    findFn?: (item: T, target: any) => boolean
}

export const insertDeepItem = <T>({
    array,
    item,
    childKey,
    parentKey,
    identityKey = 'id' as keyof T,
    findFn
}: InsertDeepItemArgs<T>) => {

    // Parent value is not null
    if (item[parentKey])
    {
        const parentItem = findRecursive({ 
            array: array, 
            identityKey, 
            target: item[parentKey], 
            childKey: childKey,
            findFn: undefined  // Use standard key-based lookup for parent
        });
        
        if (parentItem)
        {
            (parentItem[childKey] as T[]).push(item);
        }
        else
        {
            console.error("Could not find parent item to house new item", {
                result: parentItem,
                newItem: item,
                parentKey: parentKey,
                childKey: childKey,
                array: array
            })
        }
    }

    // Item is root-level
    else
    {
        array.push(item)
    }
}