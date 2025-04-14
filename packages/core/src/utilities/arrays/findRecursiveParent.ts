/**
 * Recursively searches for a parent object in an array of objects.
 *
 * @template T - The type of objects in the array.
 * @template U - The type of the target value.
 * @param {T[]} arr - The array to search in.
 * @param {keyof T} targetKey - The key of the property to search for in each object.
 * @param {U} targetValue - The value to search for.
 * @param {keyof T} childKey - The key of the property that holds the child objects.
 * @param {Function} [findFn] - Optional custom function to determine if an item matches.
 * @return {T | null} The parent object with the target value, or null if not found.
 */

interface FindRecursiveParentArgs<T, U> {
    array: T[],
    identityKey?: keyof T,
    target: U,
    childKey: keyof T,
    findFn?: (item: T, target: U) => boolean
}
export function findRecursiveParent<T, U>({
    array,
    identityKey = 'id' as keyof T,
    target,
    childKey,
    findFn
}: FindRecursiveParentArgs<T, U>): T | null
{
    for (const obj of array)
    {
        // Recursively search for the target value in the object and its children
        const result = findParent(obj, identityKey, target, childKey, findFn);
        
        if (result !== null) {
            return result;
        }
    }
    
    return null;

    function findParent<T, U>(
        obj: T,
        targetKey: keyof T,
        targetValue: U,
        childKey: keyof T,
        findFn?: (item: T, target: U) => boolean
    ): T | null
    {
        if (obj[childKey] && Array.isArray(obj[childKey])) {
            const children = obj[childKey] as T[];
            
            // Use findFn if provided, otherwise use identity comparison
            if (findFn 
                ? children.some(child => findFn(child, targetValue))
                : children.some(child => child[targetKey] === targetValue))
            {
                return obj as T;
            }
            
            // If no direct match, recursively search in each child
            for (const child of children) {
                const result = findParent(child, targetKey, targetValue, childKey, findFn);
                if (result !== null) {
                    return result;
                }
            }
        }
    
        return null;
    }
}