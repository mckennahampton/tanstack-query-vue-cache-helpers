import { render, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTanstackCacheHelpers } from '../hooks/useTanstackCacheHelpers'
import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'

const queryKey = ['test']
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

describe('addToCache', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should handle adding to an uninitialized cache', async () => {
    const { result } = renderHook(() => useTanstackCacheHelpers<{ id: number, name: string }>(queryKey), { wrapper })
    
    // Verify the query is not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)
    
    // Attempt to add an item
    await result.current.addToCache({ item: { id: 1, name: 'Test Item' } })
    
    // Verify the query is still not initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(false)
  })

  it('adds to an empty initialized cache', async () => {
    // Set initial empty data
    queryClient.setQueryData(queryKey, [])
    
    const { result } = renderHook(() => useTanstackCacheHelpers<{ id: number, name: string }>(queryKey), { wrapper })
    
    // Verify the query is initialized
    await expect.poll(() => result.current.isQueryInitialized(), pollArgs).toBe(true)
    
    // Add an item
    await result.current.addToCache({ item: { id: 1, name: 'Test Item' } })
    
    // Check that the item was added
    await expect.poll(() => {
      const data = queryClient.getQueryData(queryKey) as any[];
      return data && data.length === 1 && data[0].id === 1;
    }, pollArgs).toBe(true)
  })

  it('adds item to the front by default', async () => {
    // Set initial data
    queryClient.setQueryData(queryKey, [{ id: 2, name: 'Original Item' }])
    
    const { result } = renderHook(() => useTanstackCacheHelpers<{ id: number, name: string }>(queryKey), { wrapper })
    
    // Add a new item
    await result.current.addToCache({ item: { id: 1, name: 'New Item' } })
    
    // Check that the item was added to the front
    await expect.poll(() => {
      const data = queryClient.getQueryData(queryKey) as Array<{ id: number, name: string }>;
      return data && data.length === 2 && data[0].id === 1 && data[1].id === 2;
    }, pollArgs).toBe(true)
  })

  it('adds item to the back when specified', async () => {
    // Set initial data
    queryClient.setQueryData(queryKey, [{ id: 1, name: 'First Item' }])
    
    const { result } = renderHook(() => useTanstackCacheHelpers<{ id: number, name: string }>(queryKey), { wrapper })
    
    // Add a new item to the back
    await result.current.addToCache({ 
      item: { id: 2, name: 'Last Item' },
      placement: 'back'
    })
    
    // Check that the item was added to the back
    await expect.poll(() => {
      const data = queryClient.getQueryData(queryKey) as Array<{ id: number, name: string }>;
      return data && data.length === 2 && data[0].id === 1 && data[1].id === 2;
    }, pollArgs).toBe(true)
  })
}) 