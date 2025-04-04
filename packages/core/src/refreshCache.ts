import { IFrameworkAdapter, type IRefreshCache } from "./types"
import { type QueryKey, type QueryClient } from "@tanstack/query-core"
import { handleNotInitialized } from "./utils"

export const refreshCache = async <T extends object>(
    queryClient: QueryClient,
    queryKey: QueryKey,
    {
        items,
        identityKey = 'id' as keyof T,
        newItemsLocation = 'front'
    }: IRefreshCache<T>,
    frameworkAdapter: IFrameworkAdapter
) => {
    const data = queryClient.getQueryData<T[]>(queryKey)
    
    if (data !== undefined) {
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

        await frameworkAdapter.nextTick();
    }
    else {
        handleNotInitialized({
            call: 'refreshCache',
            queryKey,
            items
        }, queryKey)
    }
} 