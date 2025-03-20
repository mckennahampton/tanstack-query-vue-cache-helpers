import { type MaybeRef, unref } from 'vue'

/**
 * Recursively searches for a value in an array of objects.
 *
 * @template T - The type of objects in the array.
 * @template U - The type of the target value.
 * @param {T[]} arr - The array to search in.
 * @param {keyof T} targetKey - The key of the property to search for in each object.
 * @param {U} targetValue - The value to search for.
 * @param {keyof T} childKey - The key of the property that holds the child objects.
 * @return {T | null} The object with the target value, or null if not found.
 */

interface FindRecursiveArgs<T, U> {
    array: MaybeRef<T[]>,
    identityKey: keyof T,
    target: U,
    childKey: keyof T
}

export function findRecursive<T, U>({
    array,
    identityKey = 'id' as keyof T,
    target,
    childKey
}: FindRecursiveArgs<T, U>): T | null
{
    for (const obj of unref(array)) {
        
        const result = findValue(obj, identityKey, target, childKey);
        
        if (result !== null) {
            return result;
        }
    }
    
    return null;

    function findValue<T, U>(
        obj: T,
        targetKey: keyof T,
        targetValue: U,
        childKey: keyof T
    ): T | null {
        if (obj[targetKey] === targetValue) {
            return obj as T;
        }
    
        // If the current object has children, recursively search in each child
        if (obj[childKey] && Array.isArray(obj[childKey])) {
            for (const child of (obj[childKey] as T[])) {
                // Recursively search the child
                const result = findValue(child, targetKey, targetValue, childKey)
                if (result !== null) {
                    return result
                }
            }
        }
    
        return null
    }
}