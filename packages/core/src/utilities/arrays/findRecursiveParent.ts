/**
 * Recursively searches for a parent object in an array of objects.
 *
 * @template T - The type of objects in the array.
 * @template U - The type of the target value.
 * @param {T[]} arr - The array to search in.
 * @param {keyof T} targetKey - The key of the property to search for in each object.
 * @param {U} targetValue - The value to search for.
 * @param {keyof T} childKey - The key of the property that holds the child objects.
 * @return {T | null} The parent object with the target value, or null if not found.
 */

interface FindRecursiveParentArgs<T, U> {
    array: T[],
    identityKey?: keyof T,
    target: U,
    childKey: keyof T
}
export function findRecursiveParent<T, U>({
    array,
    identityKey = 'id' as keyof T,
    target,
    childKey
}: FindRecursiveParentArgs<T, U>): T | null
{
    for (const obj of array)
    {
        // Recursively search for the target value in the object and its children
        const result = findParent(obj, identityKey, target, childKey);
        
        if (result !== null) {
            return result;
        }
    }
    
    return null;

    function findParent<T, U>(
        obj: T,
        targetKey: keyof T,
        targetValue: U,
        childKey: keyof T
    ): T | null
    {
        if ((obj[childKey] as T[])?.some(child => child[targetKey] === targetValue))
        {
            // return (obj[childKey] as T[]).find(child => child[targetKey] === targetValue)
            return obj as T
        }
    
        // If the current object has children, recursively search in each child
        if (obj[childKey] && Array.isArray(obj[childKey])) {
            for (const child of (obj[childKey] as T[])) {
                const result = findParent(child, targetKey, targetValue, childKey)
                if (result !== null) {
                    return result
                }
            }
        }
    
        return null
    }
}