import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test-update']
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

type ItemType = { id: number, name: string, value: number };

describe('updateItem', () => {
  beforeEach(() => {
    queryClient.clear()
    // Initialize cache with some data
    queryClient.setQueryData<ItemType[]>(queryKey, [
      { id: 1, name: 'Item 1', value: 10 },
      { id: 2, name: 'Item 2', value: 20 },
    ])
  })

  it('should update an existing item in the cache', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    // Verify the query is initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const updatedItem: ItemType = { id: 1, name: 'Updated Item 1', value: 15 };
    
    // Update the item
    await result.current.updateItem({ item: updatedItem, identityKey: 'id' })
    
    // Check that the item was updated
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item = data?.find(i => i.id === 1);
      return item && item.name === 'Updated Item 1' && item.value === 15;
    }, pollArgs).toBe(true)

    // Check that the other item remains unchanged
    await expect.poll(() => {
        const data = queryClient.getQueryData<ItemType[]>(queryKey);
        const item = data?.find(i => i.id === 2);
        return item && item.name === 'Item 2' && item.value === 20;
      }, pollArgs).toBe(true)
  })

  it('should not update if item is not found (no error expected)', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const nonExistentItem: ItemType = { id: 3, name: 'Non Existent', value: 30 };
    const initialData = queryClient.getQueryData<ItemType[]>(queryKey);

    // Attempt to update a non-existent item
    await result.current.updateItem({ item: nonExistentItem, identityKey: 'id' })
    
    // Check that the cache remains unchanged
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return JSON.stringify(data) === JSON.stringify(initialData); // Compare stringified versions
    }, pollArgs).toBe(true)
  })

  it('should handle updating in an uninitialized cache (should not initialize)', async () => {
    queryClient.clear(); // Ensure cache is uninitialized for this test
    const uninitializedKey = ['uninitialized-update']
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(uninitializedKey), { wrapper })
    
    // Verify the query is not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)

    const itemToUpdate: ItemType = { id: 1, name: 'Attempt Update', value: 100 };

    // Attempt to update an item
    await result.current.updateItem({ item: itemToUpdate, identityKey: 'id' })
    
    // Verify the query is still not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)
  })
  
  it('should update item using a different identity key', async () => {
    const keyWithDifferentId = ['test-update-namekey'];
    type NameKeyItem = { name: string, value: number };
    queryClient.setQueryData<NameKeyItem[]>(keyWithDifferentId, [
      { name: 'Alpha', value: 1 },
      { name: 'Beta', value: 2 },
    ]);

    const { result } = renderHook(() => useTanstackCacheHelpers<NameKeyItem>(keyWithDifferentId), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const updatedItem: NameKeyItem = { name: 'Beta', value: 22 };

    // Update the item using 'name' as the identity key
    await result.current.updateItem({ item: updatedItem, identityKey: 'name' })

    // Check that the correct item was updated
    await expect.poll(() => {
      const data = queryClient.getQueryData<NameKeyItem[]>(keyWithDifferentId);
      const item = data?.find(i => i.name === 'Beta');
      return item && item.value === 22;
    }, pollArgs).toBe(true)

    // Check that the other item remains unchanged
    await expect.poll(() => {
        const data = queryClient.getQueryData<NameKeyItem[]>(keyWithDifferentId);
        const item = data?.find(i => i.name === 'Alpha');
        return item && item.value === 1;
      }, pollArgs).toBe(true)
  });
}); 