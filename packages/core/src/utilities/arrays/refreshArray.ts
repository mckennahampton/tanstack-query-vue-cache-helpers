/**
 * @description
 * Refresh an array of objects with a new set of objects based on the identity key.
 * 
 * Any items in the newItems array that have the same value for the identity key will
 * be updated in the array array.
 * 
 * Any items in the newItems array that are not in the array array will be appended
 * to the front of the array array.
 * 
 * Optionally, you can completely replace the array array with the newItems array by
 * setting the truncate parameter to true.
 * 
 * @param array 
 * @param newItems 
 * @param truncate 
 * @param identityKey 
 * @param newItemsLocation 
 * @returns
 */
interface RefreshArrayArgs<T> {
    array: T[]
    newItems: T[]
    truncate?: boolean
    identityKey?: keyof T
    newItemsLocation?: 'front' | 'back'
    debug?: boolean
    findFn?: (item: T, target: T) => boolean
}

export const refreshArray = <T>({
    array,
    newItems,
    truncate = false,
    identityKey = 'id' as keyof T,
    newItemsLocation = 'back',
    debug = false,
    findFn
}: RefreshArrayArgs<T>): T[] => {
    // Completely replace
    if (truncate || array?.length === 0) {
        // If the array is null or undefined, return a new array with the new items
        if (array == null || array === undefined) {
            return [...newItems];
        }
        // Otherwise, mutate the existing array
        else {
            array.length = 0;
            array.push(...newItems);
        }
    } else {
        newItems.forEach(newItem => {
            // Update anything that already exists
            const exists = findFn 
                ? array.some(item => findFn(item, newItem))
                : array.some(item => item[identityKey] === newItem[identityKey]);
                
            if (exists) {
                const index = findFn 
                    ? array.findIndex(item => findFn(item, newItem))
                    : array.findIndex(item => item[identityKey] === newItem[identityKey]);
                    
                array.splice(index, 1, newItem);
            }
            // Add anything new
            else {
                if (newItemsLocation === 'back') {
                    array.push(newItem);
                } else {
                    array.unshift(newItem);
                }
            }
        });
    }

    if (debug) {
        console.log('array', array);
    }
    
    return array;
}