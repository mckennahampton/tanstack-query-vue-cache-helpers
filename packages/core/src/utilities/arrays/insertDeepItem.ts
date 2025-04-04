import { findRecursive } from './findRecursive'

interface InsertDeepItemArgs<T> {
    array: T[],
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
}: InsertDeepItemArgs<T>) => {

    // Parent value is not null
    if (item[parentKey])
    {
        if (findRecursive({ array: array, identityKey, target: item[parentKey], childKey: childKey}))
        {
            (findRecursive({ array: array, identityKey, target: item[parentKey], childKey: childKey})?.[childKey] as T[]).push(item)
        }
        else
        {
            console.error("Could not find parent item to house new item", {
                result: findRecursive({ array: array, identityKey, target: item[parentKey], childKey: childKey}),
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