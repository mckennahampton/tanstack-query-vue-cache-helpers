import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test-remove-subitem']
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

type SubItemType = {
  subId: number;
  subName: string;
};

type ItemType = {
  id: number;
  name: string;
  subItems: SubItemType[];
  altId?: string;
};

describe('removeSubItem', () => {
  const initialData: ItemType[] = [
    {
      id: 1,
      name: 'Item 1',
      altId: 'A1',
      subItems: [
        { subId: 101, subName: 'Sub 1.1' },
        { subId: 102, subName: 'Sub 1.2' },
      ],
    },
    {
      id: 2,
      name: 'Item 2',
      altId: 'A2',
      subItems: [
        { subId: 201, subName: 'Sub 2.1' },
      ],
    },
  ];

  beforeEach(() => {
    queryClient.clear()
    // Initialize cache with data including sub-items
    queryClient.setQueryData<ItemType[]>(queryKey, JSON.parse(JSON.stringify(initialData))); // Deep copy
  })

  it('should remove a sub-item from a specific parent item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType, SubItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove sub-item with subId 101 from parent with id 1
    await result.current.removeSubItem({
      targetKeyValue: 1,
      identityKey: 'id',
      subItemsKey: 'subItems',
      removalKeyValue: 101,
      removalKey: 'subId'
    })
    
    // Check that sub-item 101 is removed from Item 1, but 102 remains
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item1 = data?.find(i => i.id === 1);
      const subItem101 = item1?.subItems.find(s => s.subId === 101);
      const subItem102 = item1?.subItems.find(s => s.subId === 102);
      return item1?.subItems.length === 1 && !subItem101 && subItem102?.subId === 102;
    }, pollArgs).toBe(true)

    // Check Item 2 remains unchanged
    await expect.poll(() => {
        const data = queryClient.getQueryData<ItemType[]>(queryKey);
        const item2 = data?.find(i => i.id === 2);
        return item2?.subItems.length === 1 && item2?.subItems[0].subId === 201;
      }, pollArgs).toBe(true)
  })

  it('should remove sub-item using alternative parent identity key', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType, SubItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove sub-item 201 from parent with altId 'A2'
    await result.current.removeSubItem({
      targetKeyValue: 'A2',       // Using altId
      identityKey: 'altId',      // Specifying altId as the key
      subItemsKey: 'subItems',
      removalKeyValue: 201,
      removalKey: 'subId'
    })

    // Check sub-item 201 is removed from Item 2
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item2 = data?.find(i => i.altId === 'A2');
      return item2?.subItems.length === 0;
    }, pollArgs).toBe(true)
  })

  it('should not change cache if parent item is not found', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType, SubItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)
    const originalData = queryClient.getQueryData<ItemType[]>(queryKey);

    // Attempt to remove sub-item from non-existent parent (id: 99)
    await result.current.removeSubItem({
      targetKeyValue: 99,
      identityKey: 'id',
      subItemsKey: 'subItems',
      removalKeyValue: 101,
      removalKey: 'subId'
    })
    
    // Check cache remains unchanged
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return JSON.stringify(data) === JSON.stringify(originalData);
    }, pollArgs).toBe(true)
  })

  it('should not change cache if sub-item is not found within the parent', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType, SubItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)
    const originalData = queryClient.getQueryData<ItemType[]>(queryKey);

    // Attempt to remove non-existent sub-item (subId: 999) from parent (id: 1)
    await result.current.removeSubItem({
      targetKeyValue: 1,
      identityKey: 'id',
      subItemsKey: 'subItems',
      removalKeyValue: 999,
      removalKey: 'subId'
    })
    
    // Check cache remains unchanged
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return JSON.stringify(data) === JSON.stringify(originalData);
    }, pollArgs).toBe(true)
  })

  it('should handle removing from an uninitialized cache', async () => {
    queryClient.clear(); // Ensure cache is uninitialized
    const uninitializedKey = ['uninitialized-remove-subitem'];
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType, SubItemType>(uninitializedKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)

    // Attempt to remove sub-item
    await result.current.removeSubItem({
      targetKeyValue: 1,
      identityKey: 'id',
      subItemsKey: 'subItems',
      removalKeyValue: 101,
      removalKey: 'subId'
    })
    
    // Verify the query is still not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)
  })
}); 