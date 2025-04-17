import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test-remove-deep']
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

type DeepItemType = {
  id: number;
  parentId: number | null;
  name: string;
  children?: DeepItemType[];
};

describe('removeDeepItem', () => {
  const initialData: DeepItemType[] = [
    {
      id: 1,
      parentId: null,
      name: 'Root 1',
      children: [
        { id: 11, parentId: 1, name: 'Child 1.1' },
        { 
          id: 12, 
          parentId: 1, 
          name: 'Child 1.2', 
          children: [
            { id: 121, parentId: 12, name: 'Grandchild 1.2.1' }
          ]
        },
      ],
    },
    { id: 2, parentId: null, name: 'Root 2' },
  ];

  beforeEach(() => {
    queryClient.clear()
    // Initialize cache with nested data
    queryClient.setQueryData<DeepItemType[]>(queryKey, JSON.parse(JSON.stringify(initialData))); // Deep copy
  })

  it('should remove a nested child item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove Grandchild 1.2.1 (id: 121)
    await result.current.removeDeepItem({ 
      targetKeyValue: 121, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check that Grandchild 1.2.1 is removed
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      const root1 = data?.find(i => i.id === 1);
      const child12 = root1?.children?.find(i => i.id === 12);
      const grandchild121 = child12?.children?.find(i => i.id === 121);
      return data?.length === 2 && !grandchild121 && child12?.children?.length === 0;
    }, pollArgs).toBe(true)
  })

  it('should remove a child item and its descendants', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove Child 1.2 (id: 12), which has a grandchild
    await result.current.removeDeepItem({ 
      targetKeyValue: 12, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check that Child 1.2 and its children are removed
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      const root1 = data?.find(i => i.id === 1);
      const child12 = root1?.children?.find(i => i.id === 12);
      const child11 = root1?.children?.find(i => i.id === 11);
      return data?.length === 2 && !child12 && child11 && root1?.children?.length === 1;
    }, pollArgs).toBe(true)
  })

  it('should remove a root-level item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    // Remove Root 1 (id: 1)
    await result.current.removeDeepItem({ 
      targetKeyValue: 1, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check that Root 1 is removed
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      const root1 = data?.find(i => i.id === 1);
      const root2 = data?.find(i => i.id === 2);
      return data?.length === 1 && !root1 && root2?.id === 2;
    }, pollArgs).toBe(true)
  })

  it('should not change cache if target item is not found', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)
    const originalData = queryClient.getQueryData<DeepItemType[]>(queryKey);

    // Attempt to remove non-existent item (id: 999)
    await result.current.removeDeepItem({ 
      targetKeyValue: 999, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check cache remains unchanged
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      return JSON.stringify(data) === JSON.stringify(originalData);
    }, pollArgs).toBe(true)
  })

  it('should handle removing from an uninitialized cache', async () => {
    queryClient.clear(); // Ensure cache is uninitialized
    const uninitializedKey = ['uninitialized-remove-deep'];
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(uninitializedKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)

    // Attempt to remove item with id 1
    await result.current.removeDeepItem({ 
      targetKeyValue: 1, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Verify the query is still not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)
  })
}); 