import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test-refresh-cache']
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Polling configuration
const pollArgs = {
  interval: 250,
  timeout: 10000,
};

// Wrapper component for the hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

type ItemType = { id: number, name: string, value?: number };

describe('refreshCache', () => {
  const initialData: ItemType[] = [
    { id: 1, name: 'Item 1', value: 10 },
    { id: 2, name: 'Item 2', value: 20 },
  ];

  beforeEach(() => {
    queryClient.clear()
    // Initialize cache with data
    queryClient.setQueryData<ItemType[]>(queryKey, JSON.parse(JSON.stringify(initialData))); // Deep copy
  })

  it('should add new items and update existing ones', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const refreshedItems: ItemType[] = [
      { id: 2, name: 'Item 2 Updated', value: 25 }, // Update existing
      { id: 3, name: 'Item 3 New' },                 // Add new
    ];

    await result.current.refreshCache({ items: refreshedItems, identityKey: 'id' })

    // Check cache state
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item1 = data?.find(i => i.id === 1);
      const item2 = data?.find(i => i.id === 2);
      const item3 = data?.find(i => i.id === 3);
      // New item 3 should be at the front (default), item 2 updated, item 1 untouched
      return data?.length === 3 && 
             item3?.name === 'Item 3 New' && data[0].id === 3 &&
             item2?.name === 'Item 2 Updated' && item2?.value === 25 &&
             item1?.name === 'Item 1' && item1?.value === 10;
    }, pollArgs).toBe(true)
  })

  it('should add new items to the back when specified', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const refreshedItems: ItemType[] = [
      { id: 3, name: 'Item 3 New' },
    ];

    await result.current.refreshCache({
      items: refreshedItems,
      identityKey: 'id',
      newItemsLocation: 'back' // Specify adding to the back
    })

    // Check cache state
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item3 = data?.find(i => i.id === 3);
      // New item 3 should be at the back
      return data?.length === 3 && item3?.name === 'Item 3 New' && data[2].id === 3;
    }, pollArgs).toBe(true)
  })
  
  it('should handle refreshing an empty cache', async () => {
    queryClient.setQueryData<ItemType[]>(queryKey, []); // Start with empty cache
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const refreshedItems: ItemType[] = [
      { id: 10, name: 'Only Item' },
    ];

    await result.current.refreshCache({ items: refreshedItems, identityKey: 'id' })

    // Check cache state
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return data?.length === 1 && data[0].id === 10;
    }, pollArgs).toBe(true)
  })
  
  it('should use custom findFn if provided', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const refreshedItems: ItemType[] = [
      // This item should match Item 1 based on the findFn (same name)
      { id: 101, name: 'Item 1', value: 111 }, 
    ];

    await result.current.refreshCache({
      items: refreshedItems,
      // No identityKey needed when findFn is specific enough
      findFn: (cacheItem, newItem) => cacheItem.name === newItem.name
    })

    // Check cache state
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item1 = data?.find(i => i.id === 101); // Look for the new ID
      const item2 = data?.find(i => i.id === 2); 
      // Item 1 should be updated (id 101, name 'Item 1', value 111)
      return data?.length === 2 && 
             item1?.value === 111 &&
             item2?.id === 2 && item2?.value === 20;
    }, pollArgs).toBe(true)
  });

  it('should handle refresh attempt on an uninitialized cache', async () => {
    queryClient.clear(); // Ensure cache is uninitialized
    const uninitializedKey = ['uninitialized-refresh'];
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(uninitializedKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)

    const refreshedItems: ItemType[] = [{ id: 1, name: 'Test' }];
    
    await result.current.refreshCache({ items: refreshedItems, identityKey: 'id' })
    
    // Verify the query is still not initialized and cache is empty
    await expect.poll(() => {
      const isInitialized = result.current.isQueryInitialized();
      const data = queryClient.getQueryData<ItemType[]>(uninitializedKey);
      return !isInitialized && data === undefined;
    }, pollArgs).toBe(true)
  })
}); 