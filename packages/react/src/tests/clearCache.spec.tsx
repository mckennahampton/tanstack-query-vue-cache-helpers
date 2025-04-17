import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test-clear-cache']
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

type ItemType = { id: number, name: string };

describe('clearCache', () => {

  beforeEach(() => {
    queryClient.clear()
    // Initialize cache with some data before each applicable test
  })

  it('should clear an initialized and populated cache', async () => {
    // Setup: Populate cache
    queryClient.setQueryData<ItemType[]>(queryKey, [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
    ]);

    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    // Verify cache is initialized and has data initially
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)
    await expect.poll(() => queryClient.getQueryData<ItemType[]>(queryKey)?.length, pollArgs).toBe(2)

    // Clear the cache
    await result.current.clearCache()
    
    // Check that the cache data is now an empty array
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return Array.isArray(data) && data.length === 0;
    }, pollArgs).toBe(true)

    // Query should still be considered initialized, just empty
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)
  })

  it('should handle clearing an already empty initialized cache', async () => {
    // Setup: Ensure cache is initialized but empty
    queryClient.setQueryData<ItemType[]>(queryKey, []);

    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    // Verify cache is initialized and empty
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)
    await expect.poll(() => queryClient.getQueryData<ItemType[]>(queryKey)?.length, pollArgs).toBe(0)

    // Clear the cache
    await result.current.clearCache()
    
    // Check that the cache data remains an empty array
    await expect.poll(() => {
      const data = queryClient.getQueryData<ItemType[]>(queryKey);
      return Array.isArray(data) && data.length === 0;
    }, pollArgs).toBe(true)
  })

  it('should handle clearing an uninitialized cache (no change expected)', async () => {
    // No setup needed, cache starts uninitialized
    const { result } = renderHook(() => useTanstackCacheHelpers<ItemType>(queryKey), { wrapper })
    
    // Verify cache is not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)

    // Attempt to clear the cache
    await result.current.clearCache()
    
    // Verify the query is still not initialized and cache data is undefined
    await expect.poll(() => {
        const isInitialized = result.current.isQueryInitialized();
        const data = queryClient.getQueryData<ItemType[]>(queryKey);
        return !isInitialized && data === undefined;
    }, pollArgs).toBe(true)
  })
}); 