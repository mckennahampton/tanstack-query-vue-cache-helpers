import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test-remove']
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

type ItemType = { id: number | string, name: string };

describe('removeItem', () => {
  beforeEach(() => {
    queryClient.clear()
    // Initialize cache with some data
    queryClient.setQueryData<ItemType[]>(queryKey, [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 'abc', name: 'Item ABC' },
      { id: 'def', name: 'Item DEF' },
    ])
  })

  it('should remove a single item by number ID', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove item with id 2
    await result.current.removeItem({ target: 2, identityKey: 'id' })
    
    // Check that item 2 is removed and others remain
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return data?.length === 4 && data.every(i => i.id !== 2);
    }, pollArgs).toBe(true)
  })

  it('should remove multiple items by number IDs', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove items with id 1 and 3
    await result.current.removeItem({ target: [1, 3], identityKey: 'id' })
    
    // Check that items 1 and 3 are removed
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const ids = data?.map(i => i.id);
      return data?.length === 3 && !ids?.includes(1) && !ids?.includes(3);
    }, pollArgs).toBe(true)
  })

  it('should remove a single item by string ID', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove item with id 'abc'
    await result.current.removeItem({ target: 'abc', identityKey: 'id' })
    
    // Check that item 'abc' is removed
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return data?.length === 4 && data.every(i => i.id !== 'abc');
    }, pollArgs).toBe(true)
  })

  it('should remove multiple items by string IDs', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove items with id 'abc' and 'def'
    await result.current.removeItem({ target: ['abc', 'def'], identityKey: 'id' })
    
    // Check that items 'abc' and 'def' are removed
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const ids = data?.map(i => i.id);
      return data?.length === 3 && !ids?.includes('abc') && !ids?.includes('def');
    }, pollArgs).toBe(true)
  })

  it('should remove an item using a different identity key "name"', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove item with name 'Item 2'
    await result.current.removeItem({ target: 'Item 2', identityKey: 'name' })
    
    // Check that item with name 'Item 2' is removed
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return data?.length === 4 && data.every(i => i.name !== 'Item 2');
    }, pollArgs).toBe(true)
  })

  it('should not change cache if target item is not found', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)
    const initialData = queryClient.getQueryData<ItemType[]>(queryKey);

    // Attempt to remove item with id 99
    await result.current.removeItem({ target: 99, identityKey: 'id' })
    
    // Check cache remains unchanged
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return JSON.stringify(data) === JSON.stringify(initialData);
    }, pollArgs).toBe(true)
  })

  it('should handle removing from an uninitialized cache', async () => {
    queryClient.clear(); // Ensure cache is uninitialized
    const uninitializedKey = ['uninitialized-remove'];
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(uninitializedKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)

    // Attempt to remove item with id 1
    await result.current.removeItem({ target: 1, identityKey: 'id' })
    
    // Verify the query is still not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)
  })
}); 