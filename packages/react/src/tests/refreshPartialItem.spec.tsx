import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test-refresh-partial']
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

type AddressType = { street: string; city: string; zip: string };
type TagType = { tagId: number; tagName: string };
type ItemType = {
  id: number;
  name: string;
  details: { description: string; active: boolean };
  address: AddressType;
  tags: TagType[];
};

describe('refreshPartialItem', () => {
  const initialData: ItemType[] = [
    {
      id: 1,
      name: 'Item 1',
      details: { description: 'Desc 1', active: true },
      address: { street: '123 Main St', city: 'Anytown', zip: '12345' },
      tags: [
        { tagId: 10, tagName: 'Alpha' },
        { tagId: 20, tagName: 'Beta' },
      ],
    },
    {
      id: 2,
      name: 'Item 2',
      details: { description: 'Desc 2', active: false },
      address: { street: '456 Oak Ave', city: 'Otherville', zip: '67890' },
      tags: [
        { tagId: 30, tagName: 'Gamma' },
      ],
    },
  ];

  beforeEach(() => {
    queryClient.clear()
    // Initialize cache with complex data
    queryClient.setQueryData<ItemType[]>(queryKey, JSON.parse(JSON.stringify(initialData))); // Deep copy
  })

  it('should update a simple property (name) of an item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    await result.current.refreshPartialItem({
      targetKeyValue: 1,
      identityKey: 'id',
      updateKey: 'name',
      updatedContent: 'Item 1 Updated Name'
    })

    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item1 = data?.find(i => i.id === 1);
      return item1?.name === 'Item 1 Updated Name';
    }, pollArgs).toBe(true)
  })

  it('should update a nested property (details.active)', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    await result.current.refreshPartialItem({
      targetKeyValue: 1,
      identityKey: 'id',
      updateKey: 'details',
      updatedContent: { description: 'Desc 1', active: false } // Only changing active
    })

    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item1 = data?.find(i => i.id === 1);
      return item1?.details.active === false && item1?.details.description === 'Desc 1';
    }, pollArgs).toBe(true)
  })

  it('should update an entire nested object property (address)', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const newAddress: AddressType = { street: '789 Pine Ln', city: 'Newplace', zip: '54321' };
    await result.current.refreshPartialItem({
      targetKeyValue: 1,
      identityKey: 'id',
      updateKey: 'address',
      updatedContent: newAddress
    })

    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item1 = data?.find(i => i.id === 1);
      return item1?.address.street === '789 Pine Ln' && item1?.address.city === 'Newplace';
    }, pollArgs).toBe(true)
  })

  it('should update items within an array property (tags) using identity key', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType, TagType>(queryKey), { wrapper })
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const updatedTags: TagType[] = [
      { tagId: 20, tagName: 'Beta Updated' }, // Update existing tag
      { tagId: 40, tagName: 'Delta New' },      // Add new tag
    ];

    await result.current.refreshPartialItem({
      targetKeyValue: 1,
      identityKey: 'id',
      updateKey: 'tags',
      // @ts-expect-error - Linter struggles with array content type vs U generic here
      updatedContent: updatedTags,
      updatedItemsIdentityKey: 'tagId'
    })

    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item1 = data?.find(i => i.id === 1);
      const tag10 = item1?.tags.find(t => t.tagId === 10);
      const tag20 = item1?.tags.find(t => t.tagId === 20);
      const tag40 = item1?.tags.find(t => t.tagId === 40);
      return item1?.tags.length === 3 && 
             tag10?.tagName === 'Alpha' && 
             tag20?.tagName === 'Beta Updated' &&
             tag40?.tagName === 'Delta New';
    }, pollArgs).toBe(true)
  })
  
  it('should replace array property (tags) when treatArrayAsObject is true', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType, TagType>(queryKey), { wrapper })
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const newTags: TagType[] = [
      { tagId: 50, tagName: 'Epsilon Only' },
    ];

    await result.current.refreshPartialItem({
      targetKeyValue: 1,
      identityKey: 'id',
      updateKey: 'tags',
      // @ts-expect-error - Linter struggles with array content type vs U generic here
      updatedContent: newTags,
      treatArrayAsObject: true
    })

    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item1 = data?.find(i => i.id === 1);
      return item1?.tags.length === 1 && item1.tags[0].tagId === 50;
    }, pollArgs).toBe(true)
  })

  it('should use custom findFn to locate the target item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    await result.current.refreshPartialItem({
      targetKeyValue: 'Item 2', // Target value for findFn
      findFn: (item, targetValue) => item.name === targetValue, // Custom find logic
      updateKey: 'details',
      updatedContent: { description: 'Desc 2 Updated by Name', active: true }
    })

    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      const item2 = data?.find(i => i.id === 2);
      return item2?.details.description === 'Desc 2 Updated by Name' && item2.details.active === true;
    }, pollArgs).toBe(true)
  })

  it('should handle partial update attempt on an uninitialized cache', async () => {
    queryClient.clear(); // Ensure cache is uninitialized
    const uninitializedKey = ['uninitialized-partial-refresh'];
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(uninitializedKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)

    await result.current.refreshPartialItem({
      targetKeyValue: 1,
      identityKey: 'id',
      updateKey: 'name',
      updatedContent: 'Attempt Update'
    })
    
    // Verify the query is still not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)
  })
}); 