import { type MaybeRef, unref, isRef } from 'vue'

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
    array: MaybeRef<T[]> | T[]
    newItems: MaybeRef<T[]> | T[]
    truncate?: boolean
    identityKey?: keyof T
    newItemsLocation?: 'front' | 'back'
    debug?: boolean
}
export const refreshArray = <T>({
    array,
    newItems,
    truncate = false,
    identityKey = 'id' as keyof T,
    newItemsLocation = 'back',
}: RefreshArrayArgs<T>): MaybeRef<T[]> =>
{

    // Completely replace
    if (truncate || unref(array)?.length == 0)
    {
        // If the array delta is not an array, we can instatiate it with the new items
        // while still keeping reactivity
        if (unref(array) == null || unref(array) == undefined)
        {
            if (isRef(array))
            {
                array.value = unref(newItems)
            }
            else
            {
                array = unref(newItems)
            }
        }

        // If the array delta is already an array, if we replace it with a new array,
        // we lose reactivity on the delta. In the case of updating a Pinia store
        // ref, it would look like nothing happened to the original array.
        // Thus we need to mutate the existing array instead of creating a new one, as
        // this will reatin.
        else
        {
            unref(array).length = 0
            unref(array).push(...unref(newItems))
        }
    }

    else
    {
        unref(newItems).forEach(newItem => {

            // Update anything that already exists
            if (unref(array).some(item => item[identityKey] == newItem[identityKey]))
            {
                unref(array).splice(unref(array).findIndex(item => item[identityKey] == newItem[identityKey]), 1, newItem)
            }

            // Add anything new
            else
            {
                if (newItemsLocation == 'back')
                {
                    unref(array).push(newItem)
                }

                else
                {
                    unref(array).unshift(newItem)
                }
            }
        })
    }

    console.log('array', unref(array))
    return array
}