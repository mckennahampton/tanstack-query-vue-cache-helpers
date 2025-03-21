import { ref, type Ref, unref, nextTick } from "vue"
import { usePage } from "@inertiajs/vue3"
import { type MaybeRefDeep } from "../../node_modules/@tanstack/vue-query/build/modern/types"
import { type InitialDataFunction, useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/vue-query"
import { refreshArray, findRecursive, insertDeepItem, updateDeepItem, removeDeepItem, removeArrayItem } from '../utilities/arrays/arrays'

export interface RemoveArrayItemOptions<T, U> {
    targetKeyValue: string | number,
    identityKey?: keyof T,
    subItemsKey: keyof T,
    removalKeyValue: U[keyof U],
    removalKey?: keyof U
}

/**
 * I was using the same code over and over so this just helps reduce the boiletplate a little.
 * This will pickup any init props the page has and instantiate the cache with it if it exists.
 */
export const queryFactory = <T>(config: {
    queryKey: string,
    queryFn: () => Promise<T[]>,
    aditionalConfig?: Omit<UseQueryOptions, 'queryKey'>,
    useInitialData?: boolean
}) => {
    const { queryKey, queryFn } = config;
    const initialData = config.useInitialData ? usePage().props[queryKey] as MaybeRefDeep<T[] | InitialDataFunction<T[]>> : false
    return useQuery({
        queryKey: [queryKey],
        queryFn,
        ...(initialData && {
            initialData: unref(initialData),
            // staleTime: 60 * 1000, // 1 minute
            initialDataUpdatedAt: Date.now(),
        }),
        ...config.aditionalConfig,
    });
};

/**
 * This removes the need for a bunch of boilerplate code to handle the confirmation prompt
 * effectively. With this there is no need to catch errors on the implementation side and
 * no need to track progress with your own loading refs and all that
 */
const CANCELLED_MUTATION = Symbol("CANCELLED_MUTATION");
export const mutationFactory = <T, D>(config: {
    mutationFn: (data: D) => Promise<T>;
    onSuccessFn: MaybeRefDeep<(data: any, variables: D, context: unknown) => unknown>,
    confirm?: (data: D, loading: Ref<boolean>) => Promise<boolean>
}) => {
    return useMutation({
        mutationFn: async(data: D) => {
            const loading = ref(false)

            // If confirmation is required and denied, return early without throwing an error
            if (config.confirm) {
                if (!(await config.confirm(data, loading))) {
                    return CANCELLED_MUTATION as unknown as T; 
                }
            }

            loading.value = true;
            return config.mutationFn(data).finally(() => loading.value = false)
        },
        onSuccess: (data, variables, context) => {
            // Prevent calling onSuccessFn if the mutation was cancelled
            if (data === CANCELLED_MUTATION) return;

            unref(config.onSuccessFn)(data, variables, context);
        }
    })
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
export const useTanstackCacheHelpers = <T extends object>(queryKey: any) => {
    const queryClient = useQueryClient()

    const isQueryInitialized = () => {
        const data = queryClient.getQueryData(queryKey);
        return data !== undefined;
    }


    // Add new items to the cache
    // Note: Does not update any existing items
    const addToTanstackCache = async ({ item, placement = 'start' }: AddToTanstackCacheOptions<T>) => {
    
        // Get the current data of the query
        let currentData = queryClient.getQueryData(queryKey)
        // Add the new item to the cache
        if (currentData) {
            await queryClient.setQueryData(
                queryKey,
                (array: T[]) => placement == 'start' ? [item, ...array] : [...array, item]
            )
        }

        await nextTick();
    }

    // Update items in the cache
    // Note: does not add any new items
    const updateItemInTanstackCache = async ({ item, identityKey = 'id' as keyof T }: UpdateItemInTanstackCacheOptions<T>) => {
        // Get the current data of the query
        const currentData = queryClient.getQueryData(queryKey)
          
        // Add the new item to the cache
        // if (currentData) {
            queryClient.setQueryData(
                queryKey,
                (array: T[]) => {
                    let data = Array.isArray(array) ? [...array] : []
                    return data.map(_item => _item[identityKey] === item[identityKey] ? item : _item)
                }
            )
        // }

        await nextTick();
    }

    const removeFromTanstackCache = async ({ target, identityKey = 'id' as keyof T }: RemoveFromTanstackCacheOptions<T>) => {
        
        // Get the current data of the query
        const currentData = queryClient.getQueryData(queryKey)
          
        // Add the new item to the cache
        // if (currentData) {
            queryClient.setQueryData(
                [queryKey],
                (array: T[]) => {
                    let data = Array.isArray(array) ? [...array] : []
                    return data.filter(item => {
                        if (Array.isArray(target)) {
                            //@ts-ignore
                            return !target.includes(item[identityKey])
                        }
                        return item[identityKey] !== target
                    })
                }
            )
        // }

        await nextTick();
    }

    const clearTanstackCache = async () => {
        // Get the current data of the query
        const currentData = queryClient.getQueryData(queryKey)
          
        // Add the new item to the cache
        // if (currentData) {
            queryClient.setQueryData(
                queryKey,
                []
            )
        // }

        await nextTick();
    }

    // Updates any existing items in the cache, and adds new items
    const refreshTanstackCache = async ({
        items,
        identityKey = 'id' as keyof T,
        newItemsLocation = 'front'
    }: RefreshTanstackCacheOptions<T>) => {
        // Get the current data of the query
        const currentData = queryClient.getQueryData(queryKey)
        // if (currentData) {
            queryClient.setQueryData(
                queryKey,
                (array: T[]) => {
                    let temp = Array.isArray(array) ? [...array] : []
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
        // }
    }

    const refreshDeepItemInTanstackCache = async ({
        item,
        childKey,
        parentKey,
        identityKey = 'id' as keyof T
    }: RefreshDeepItemInTanstackCache<T>) => {
        const currentData = queryClient.getQueryData(queryKey)
        // if (currentData) {
            queryClient.setQueryData(
                queryKey,
                (array: T[]) => {
                    let data = Array.isArray(array) ? [...array] : []
                    const reactiveArrayCopy = ref<T[]>([]) as Ref<T[]>
                    data.forEach(item => reactiveArrayCopy.value.push(item))

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
                            console.log('calling udpateDeepItem')
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
        // }

        await nextTick();
    }

    const removeDeepItemFromTanstackCache = async ({
        targetKeyValue,
        childKey,
        parentKey,
        identityKey = 'id' as keyof T
    }: RemoveDeepItemFromTanstackCacheOptions<T>) => {
        const currentData = queryClient.getQueryData(queryKey)
        // if (currentData) {
            queryClient.setQueryData(
                queryKey,
                (array: T[]) => {
                    let data = Array.isArray(array) ? [...array] : []
                    const reactiveArrayCopy = ref<T[]>([]) as Ref<T[]>
                    data.forEach(item => reactiveArrayCopy.value.push(item))

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
        // }

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
        const currentData = queryClient.getQueryData(queryKey)
        // if (currentData) {

            queryClient.setQueryData(
                queryKey,
                (array: T[]) => {
                    // Create a shallow copy of the cache array
                    let data = Array.isArray(array) ? [...array] : []
                    const newCacheArray = data.map(item => ({ ...item }));
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
        // }

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
        const currentData = queryClient.getQueryData(queryKey)
        // if (currentData) {
            queryClient.setQueryData(
                queryKey,
                (array: T[]) => {
                    let data = Array.isArray(array) ? [...array] : []
                    // Create a shallow copy of the cache array
                    const newCacheArray = data.map(item => ({ ...item }));
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
        // }

        await nextTick();
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