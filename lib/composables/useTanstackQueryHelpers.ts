import { ref, type Ref, unref, nextTick, toValue } from "vue"
import { usePage } from "@inertiajs/vue3"
import { type MaybeRefDeep } from "../../node_modules/@tanstack/vue-query/build/modern/types"
import {
    type DefaultError,
    type InitialDataFunction,
    type MutationOptions,
    type QueryFunction,
    type QueryKey,
    useMutation,
    // type UseMutationOptions,
    useQueryClient,
    type UseQueryOptions,
    type UseMutationReturnType,
    type UseQueryReturnType
} from "@tanstack/vue-query"
import { refreshArray, findRecursive, insertDeepItem, updateDeepItem, removeDeepItem, removeArrayItem } from '../utilities/arrays/arrays'

export interface RemoveArrayItemOptions<T, U> {
    targetKeyValue: string | number,
    identityKey?: keyof T,
    subItemsKey: keyof T,
    removalKeyValue: U[keyof U],
    removalKey?: keyof U
}

interface AddToTanstackCacheOptions<T> {
    item: T,
    placement?: 'start' | 'back'
}
interface UpdateItemInTanstackCacheOptions<T> {
    item: T,
    identityKey?: keyof T
}
interface RemoveFromTanstackCacheOptions<T> {
    target: number | number[] | string | string[],
    identityKey?: keyof T,
}
interface RefreshTanstackCacheOptions<T> {
    items: T[],
    identityKey?: keyof T,
    newItemsLocation?: 'front' | 'back'
}
interface RefreshDeepItemInTanstackCache<T> {
    item: T,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T
}
interface RemoveDeepItemFromTanstackCacheOptions<T> {
    targetKeyValue: T | number,
    childKey: keyof T,
    parentKey: keyof T,
    identityKey?: keyof T
}
interface RefreshPartialItemInTanstackCacheOptions<T, U> {
    targetKeyValue: string | number,
    identityKey?: keyof T,
    replacementKey: keyof T,
    replacementContent: U,
    replacementItemsIdentityKey?: keyof U,
    treatArrayAsObject?: boolean, // Necessary if the expected data is to be treated as an object (i.e. a key => value array in PHP), but is initially empty, in which case it just looks like an array here. Otherwise this function will inject an array with a single item instead of the base object
    debug?: boolean
}

export const useTanstackCacheHelpers = <T extends object, TTaggedQueryKey extends QueryKey = QueryKey>(queryKey: TTaggedQueryKey) => {
    const queryClient = useQueryClient()

    const isQueryInitialized = () => {
        const data = queryClient.getQueryData(queryKey);
        return data !== undefined;
    }


    // Add new items to the cache
    // Note: Does not update any existing items
    const addToTanstackCache = async ({ item, placement = 'start' }: AddToTanstackCacheOptions<T>) => {
    
        // Add the new item to the cache
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                cacheArray => placement == 'start' ? [item, ...cacheArray!] : [...cacheArray!, item]
            )

            await nextTick();
        }

        else {
            handleNotInitialized({
                call: 'addToTanstackCache',
                queryKey,
                item
            })
        }

    }

    // Update items in the cache
    // Note: does not add any new items
    const updateItemInTanstackCache = async ({ item, identityKey = 'id' as keyof T }: UpdateItemInTanstackCacheOptions<T>) => {
        // Get the current data of the query
          
        // Add the new item to the cache
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                cacheArray => {
                    return cacheArray!.map(_item => _item[identityKey] === item[identityKey] ? item : _item)
                }
            )

            await nextTick();
        }

        else {
            handleNotInitialized({
                call: 'updateItemInTanstackCache',
                queryKey,
                item
            })
        }

    }

    const removeFromTanstackCache = async ({ target, identityKey = 'id' as keyof T }: RemoveFromTanstackCacheOptions<T>) => {
        
        // Add the new item to the cache
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                cacheArray => {
                    return cacheArray!.filter(item => {
                        if (Array.isArray(target)) {
                            return !(target as Array<T[typeof identityKey]>).includes(item[identityKey] as T[typeof identityKey]);
                        }
                        return item[identityKey] !== target
                    })
                }
            )

            await nextTick();
        }

        else {
            handleNotInitialized({
                call: 'removeFromTanstackCache',
                queryKey,
                target
            })
        }

    }

    const clearTanstackCache = async () => {
          
        // Add the new item to the cache
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                []
            )

            await nextTick();
        }

        else {
            handleNotInitialized({
                call: 'clearTanstackCache',
                queryKey
            })
        }

    }

    // Updates any existing items in the cache, and adds new items
    const refreshTanstackCache = async ({
        items,
        identityKey = 'id' as keyof T,
        newItemsLocation = 'front'
    }: RefreshTanstackCacheOptions<T>) => {
        // Get the current data of the query
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                cacheArray => {
                    let temp = [...cacheArray!]
                    items.forEach(newItem => {

                        // Update anything that already exists
                        let index = temp.findIndex(item => newItem[identityKey] == item[identityKey])
                        if (index != -1) {
                            // console.log(`Updating item in cache: ${newItem[identityKey]}`, newItem, array[index])
                            temp.splice(index, 1, newItem)
                        }

                        // Add anything new
                        else
                        {
                            if (newItemsLocation == 'back')
                            {
                                // console.log(`Adding new item to back of cache: ${newItem[identityKey]}`)
                                temp.push(newItem)
                            }
            
                            else
                            {
                                // console.log(`Adding new item to front of cache: ${newItem[identityKey]}`)
                                temp.unshift(newItem)
                            }
                        }

                    })
                    return temp
                }
            )

            await nextTick();
        }

        else {
            handleNotInitialized({
                call: 'refreshTanstackCache',
                queryKey,
                items
            })
        }
    }

    const refreshDeepItemInTanstackCache = async ({
        item,
        childKey,
        parentKey,
        identityKey = 'id' as keyof T
    }: RefreshDeepItemInTanstackCache<T>) => {
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                cacheArray => {
                    let temp = [...cacheArray!]
                    const reactiveArrayCopy = ref<T[]>([]) as Ref<T[]>
                    temp.forEach(item => reactiveArrayCopy.value.push(item))

                    if (item[parentKey])
                    {   
                        let targetItem = findRecursive({
                            array: reactiveArrayCopy,
                            identityKey: identityKey,
                            target: item[identityKey],
                            childKey: childKey
                        })

                        if (targetItem)
                        {
                            updateDeepItem({
                                array: reactiveArrayCopy,
                                item: item,
                                childKey: childKey,
                                parentKey: parentKey,
                                identityKey: identityKey
                            })
                        }
                
                        else
                        {
                            insertDeepItem({
                                array: reactiveArrayCopy,
                                item: item,
                                childKey: childKey,
                                parentKey: parentKey,
                                identityKey: identityKey
                            })
                        }
                    }
                
                    // Item is root-level
                    else
                    {
                        refreshArray({ array: reactiveArrayCopy, newItems: [item] })
                    }

                    return reactiveArrayCopy.value
                }
            )
        }

        else {
            handleNotInitialized({
                call: 'refreshDeepItemInTanstackCache',
                queryKey,
                item,
                childKey,
                parentKey
            })
        }

        await nextTick();
    }

    const removeDeepItemFromTanstackCache = async ({
        targetKeyValue,
        childKey,
        parentKey,
        identityKey = 'id' as keyof T
    }: RemoveDeepItemFromTanstackCacheOptions<T>) => {
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                cacheArray => {
                    let temp = [...cacheArray!]
                    const reactiveArrayCopy = ref<T[]>([]) as Ref<T[]>
                    temp.forEach(item => reactiveArrayCopy.value.push(item))

                    removeDeepItem({
                        array: reactiveArrayCopy,
                        oldItem: targetKeyValue,
                        childKey: childKey,
                        parentKey: parentKey,
                        identityKey: identityKey
                    })

                    return reactiveArrayCopy.value
                }
            )
        }

        else {
            handleNotInitialized({
                call: 'removeDeepItemFromTanstackCache',
                queryKey,
                targetKeyValue,
                childKey,
                parentKey
            })
        }

        await nextTick();
    }

    const refreshPartialItemInTanstackCache = async <U>({
        targetKeyValue,
        identityKey = 'id' as keyof T,
        replacementKey,
        replacementContent,
        replacementItemsIdentityKey = 'id' as keyof U,
        treatArrayAsObject = false,
        debug = false
    }: RefreshPartialItemInTanstackCacheOptions<T, U>) => {
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                cacheArray => {
                    // Create a shallow copy of the cache array
                    let temp = [...cacheArray!]
                    const newCacheArray = temp.map(item => ({ ...item }));
                    const target = newCacheArray.find(
                        item => JSON.stringify(item[identityKey]) === JSON.stringify(targetKeyValue)
                    );
            
                    if (target) {
                        if (Array.isArray(target[replacementKey]) && !treatArrayAsObject) {
                            // Create a shallow copy of the target's array
                            const newSubArray = [...target[replacementKey]];
            
                            // Use your `refreshArray` method to modify the array
                            refreshArray<U>({
                                array: newSubArray,
                                newItems: Array.isArray(replacementContent) ? replacementContent : [replacementContent],
                                newItemsLocation: 'back',
                                identityKey: replacementItemsIdentityKey,
                            });
            
                            // Assign the new array back to the target
                            target[replacementKey] = newSubArray as T[keyof T];
                        } else {
                            target[replacementKey] = replacementContent as T[keyof T];
                        }
                    }
                    return newCacheArray
                }
            );
        }

        else {
            handleNotInitialized({
                call: 'refreshPartialItemInTanstackCache',
                queryKey,
                targetKeyValue,
                replacementKey,
                replacementContent
            })
        }

        await nextTick();
    }

    /**
     * Remove a sub-item from a primary item in the cached array.
     * If the primary item has an array of sub-items, the target sub-item will be removed from the array.
     * If the primary item is a single sub-item, the target sub-item will be nullified on the primary item.
     */
    const removeSubItemFromTanstackCache = async <U>({
        identityKey = 'id' as keyof T, // Identity key for the primary item
        targetKeyValue, // value of T['id']
        subItemsKey, // Key for the sub-item array/singleton
        removalKey = 'id' as keyof U, // Identity key for the sub-item to be removed
        removalKeyValue // value of U['id']
    }: RemoveArrayItemOptions<T, U>) => {
        if (isQueryInitialized()) {
            queryClient.setQueryData<T[]>(
                queryKey,
                cacheArray => {
                    let temp = [...cacheArray!]
                    // Create a shallow copy of the cache array
                    const newCacheArray = temp.map(item => ({ ...item }));
                    const target = newCacheArray.find(
                        item => JSON.stringify(item[identityKey]) === JSON.stringify(targetKeyValue)
                    );

                    if (target)
                    {
                        // If the primary item has an array of sub-items, remove the target sub-item from the array
                        if (Array.isArray(target[subItemsKey]))
                        {
                            // Create a shallow copy of the target's array
                            const newSubArray = [...target[subItemsKey]];

                            // Remove the target sub-item from the sub-items array
                            removeArrayItem<U>({
                                array: newSubArray,
                                identityValues: [removalKeyValue as number],
                                identityKey: removalKey
                            })

                            // Update the target sub-items array
                            target[subItemsKey] = newSubArray as T[keyof T];
                        }
                        
                        else
                        {
                            // If the primary item is a single sub-item, nullify the target sub-item
                            target[subItemsKey] = null as T[keyof T];
                        }
                    }

                    // Return the update local reactive copy of the cache
                    return newCacheArray
                }
            )
        }

        else {
            handleNotInitialized({
                call: 'removeSubItemFromTanstackCache',
                queryKey,
                targetKeyValue,
                subItemsKey,
                removalKeyValue
            })
        }

        await nextTick();
    }

    const handleNotInitialized = (args: any) => {
        console.debug(
            `Query with key ${JSON.stringify(queryKey)} is not initialized. Please ensure the query is initialized before attempting to modify the cache.`,
            args
        )
    }

    return {
        queryClient,
        isQueryInitialized,
        addToTanstackCache,
        updateItemInTanstackCache,
        removeFromTanstackCache,
        clearTanstackCache,
        refreshTanstackCache,
        refreshDeepItemInTanstackCache,
        removeDeepItemFromTanstackCache,
        refreshPartialItemInTanstackCache,
        removeSubItemFromTanstackCache
    }
}