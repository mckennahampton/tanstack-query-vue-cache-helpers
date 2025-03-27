import { nextTick } from "vue"
import { type IRefreshCache } from "../types"
import { handleNotInitialized, isQueryInitialized } from "../utils"
import { type QueryKey, type QueryClient } from "@tanstack/vue-query"

export const refreshCache = async <T extends object>(
    queryClient: QueryClient, 
    queryKey: QueryKey, 
    {
        items,
        identityKey = 'id' as keyof T,
        newItemsLocation = 'front'
    }: IRefreshCache<T>
) => {
    if (isQueryInitialized(queryClient, queryKey)) {
        queryClient.setQueryData<T[]>(
            queryKey,
            cacheArray => {
                let temp = [...cacheArray!]
                items.forEach(newItem => {
                    // Update anything that already exists
                    let index = temp.findIndex(item => newItem[identityKey] == item[identityKey])
                    if (index != -1) {
                        temp.splice(index, 1, newItem)
                    }
                    // Add anything new
                    else {
                        if (newItemsLocation == 'back') {
                            temp.push(newItem)
                        }
                        else {
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
            call: 'refreshCache',
            queryKey,
            items
        }, queryKey)
    }
} 