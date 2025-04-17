import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test-refresh-deep']
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
  value?: number;
  children?: DeepItemType[];
};

describe('refreshDeepItem', () => {
  const initialData: DeepItemType[] = [
    {
      id: 1,
      parentId: null,
      name: 'Root 1',
      value: 10,
      children: [
        { id: 11, parentId: 1, name: 'Child 1.1', value: 110 },
        { 
          id: 12, 
          parentId: 1, 
          name: 'Child 1.2', 
          value: 120,
          children: [
            { id: 121, parentId: 12, name: 'Grandchild 1.2.1', value: 1210 }
          ]
        },
      ],
    },
    { id: 2, parentId: null, name: 'Root 2', value: 20 },
  ];

  beforeEach(() => {
    queryClient.clear()
    // Initialize cache with nested data
    queryClient.setQueryData<DeepItemType[]>(queryKey, JSON.parse(JSON.stringify(initialData))); // Deep copy
  })

  it('should update an existing nested item (grandchild)', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const updatedGrandchild: DeepItemType = { 
      id: 121, 
      parentId: 12, 
      name: 'Grandchild 1.2.1 Updated', 
      value: 1211 
    };

    await result.current.refreshDeepItem({ 
      item: updatedGrandchild, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check that Grandchild 1.2.1 is updated
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      const root1 = data?.find(i => i.id === 1);
      const child12 = root1?.children?.find(i => i.id === 12);
      const grandchild121 = child12?.children?.find(i => i.id === 121);
      return grandchild121?.name === 'Grandchild 1.2.1 Updated' && grandchild121?.value === 1211;
    }, pollArgs).toBe(true)
  })

  it('should update an existing child item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const updatedChild: DeepItemType = { 
      id: 11, 
      parentId: 1, 
      name: 'Child 1.1 Updated', 
      value: 111 
    };

    await result.current.refreshDeepItem({ 
      item: updatedChild, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check that Child 1.1 is updated
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      const root1 = data?.find(i => i.id === 1);
      const child11 = root1?.children?.find(i => i.id === 11);
      return child11?.name === 'Child 1.1 Updated' && child11?.value === 111;
    }, pollArgs).toBe(true)
  })

  it('should update an existing root-level item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const updatedRoot: DeepItemType = { 
      id: 2, 
      parentId: null, 
      name: 'Root 2 Updated', 
      value: 22 
    };

    await result.current.refreshDeepItem({ 
      item: updatedRoot, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check that Root 2 is updated
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      const root2 = data?.find(i => i.id === 2);
      return root2?.name === 'Root 2 Updated' && root2?.value === 22;
    }, pollArgs).toBe(true)
  })

  it('should add a new item as a child to an existing item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const newChild: DeepItemType = { 
      id: 13, 
      parentId: 1, // Add as child of Root 1
      name: 'Child 1.3 New', 
      value: 130 
    };

    await result.current.refreshDeepItem({ 
      item: newChild, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check that Child 1.3 is added to Root 1
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      const root1 = data?.find(i => i.id === 1);
      const child13 = root1?.children?.find(i => i.id === 13);
      return root1?.children?.length === 3 && child13?.name === 'Child 1.3 New';
    }, pollArgs).toBe(true)
  })

  it('should add a new root-level item', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(queryKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)

    const newRoot: DeepItemType = { 
      id: 3, 
      parentId: null, 
      name: 'Root 3 New', 
      value: 30 
    };

    await result.current.refreshDeepItem({ 
      item: newRoot, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Check that Root 3 is added
    await expect.poll(() => {
      const data = queryClient.getQueryData<DeepItemType[]>(queryKey);
      const root3 = data?.find(i => i.id === 3);
      return data?.length === 3 && root3?.name === 'Root 3 New';
    }, pollArgs).toBe(true)
  })

  it('should handle refresh attempt on an uninitialized cache', async () => {
    queryClient.clear(); // Ensure cache is uninitialized
    const uninitializedKey = ['uninitialized-refresh-deep'];
    const { result } = renderHook(() => useTanstackCacheHelpers<DeepItemType>(uninitializedKey), { wrapper })
    
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)

    const itemToRefresh: DeepItemType = { id: 1, parentId: null, name: 'Test' };
    
    await result.current.refreshDeepItem({ 
      item: itemToRefresh, 
      childKey: 'children', 
      parentKey: 'parentId', 
      identityKey: 'id' 
    })
    
    // Verify the query is still not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)
  })
}); 