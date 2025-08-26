# Advanced Patterns

This page covers advanced usage patterns and best practices for production applications.

## Optimistic Updates

Optimistic updates provide immediate UI feedback by updating the cache before the server responds.

### Basic Optimistic Update Pattern

```typescript
import { useMutation } from '@tanstack/vue-query'

const createUserMutation = useMutation({
  mutationFn: createUser,
  onMutate: async (newUser) => {
    // Optimistically add user to cache
    await helpers.addToCache({
      item: { id: Date.now(), ...newUser },
      placement: 'start'
    })
  },
  onSuccess: (response) => {
    // Update with real server data
    helpers.updateItem({
      item: response.data,
      identityKey: 'id'
    })
  },
  onError: (error, variables) => {
    // Revert optimistic update on error
    helpers.removeItem({
      target: Date.now(),
      identityKey: 'id'
    })
  }
})
```

### Advanced Optimistic Update with Rollback

```typescript
const useOptimisticUserUpdate = () => {
  const helpers = useTanstackCacheHelpers<User>(['users'])
  
  const updateUserOptimistically = async (user: User, updates: Partial<User>) => {
    // Store original data for rollback
    const originalUser = { ...user }
    const optimisticUser = { ...user, ...updates }
    
    try {
      // Optimistic update
      await helpers.updateItem({
        item: optimisticUser,
        identityKey: 'id'
      })
      
      // Make API call
      const response = await updateUserAPI(user.id, updates)
      
      // Update with server response
      await helpers.updateItem({
        item: response.data,
        identityKey: 'id'
      })
      
      return response.data
    } catch (error) {
      // Rollback on error
      await helpers.updateItem({
        item: originalUser,
        identityKey: 'id'
      })
      throw error
    }
  }
  
  return { updateUserOptimistically }
}
```

### Optimistic Delete with Undo

```typescript
const useOptimisticDelete = () => {
  const helpers = useTanstackCacheHelpers<User>(['users'])
  const deletedItems = ref<Map<number, User>>(new Map())
  
  const deleteUserOptimistically = async (userId: number) => {
    // Store user for potential undo
    const user = users.value?.find(u => u.id === userId)
    if (user) {
      deletedItems.value.set(userId, user)
    }
    
    try {
      // Optimistic delete
      await helpers.removeItem({
        target: userId,
        identityKey: 'id'
      })
      
      // Make API call
      await deleteUserAPI(userId)
      
      // Remove from deleted items map
      deletedItems.value.delete(userId)
    } catch (error) {
      // Restore on error
      if (user) {
        await helpers.addToCache({
          item: user,
          placement: 'start'
        })
      }
      throw error
    }
  }
  
  const undoDelete = async (userId: number) => {
    const user = deletedItems.value.get(userId)
    if (user) {
      await helpers.addToCache({
        item: user,
        placement: 'start'
      })
      deletedItems.value.delete(userId)
    }
  }
  
  return { deleteUserOptimistically, undoDelete, deletedItems }
}
```

## Error Handling Strategies

### Comprehensive Error Handling

```typescript
const useSafeCacheOperations = () => {
  const helpers = useTanstackCacheHelpers<User>(['users'])
  
  const safeAddUser = async (user: User) => {
    try {
      // Check if cache is initialized
      if (!helpers.isQueryInitialized()) {
        throw new Error('Cache not initialized')
      }
      
      // Validate user data
      if (!user.id || !user.name) {
        throw new Error('Invalid user data')
      }
      
      // Check for duplicates
      const existingUser = users.value?.find(u => u.id === user.id)
      if (existingUser) {
        throw new Error('User already exists')
      }
      
      // Perform operation
      await helpers.addToCache({
        item: user,
        placement: 'start'
      })
      
      return user
    } catch (error) {
      console.error('Failed to add user:', error)
      // Show user-friendly error message
      showErrorNotification('Failed to add user. Please try again.')
      throw error
    }
  }
  
  const safeUpdateUser = async (user: User) => {
    try {
      if (!helpers.isQueryInitialized()) {
        throw new Error('Cache not initialized')
      }
      
      // Check if user exists
      const existingUser = users.value?.find(u => u.id === user.id)
      if (!existingUser) {
        throw new Error('User not found')
      }
      
      await helpers.updateItem({
        item: user,
        identityKey: 'id'
      })
      
      return user
    } catch (error) {
      console.error('Failed to update user:', error)
      showErrorNotification('Failed to update user. Please try again.')
      throw error
    }
  }
  
  return { safeAddUser, safeUpdateUser }
}
```

### Retry Logic with Exponential Backoff

```typescript
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        break
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

const useRetryableCacheOperations = () => {
  const helpers = useTanstackCacheHelpers<User>(['users'])
  
  const addUserWithRetry = async (user: User) => {
    return retryWithBackoff(async () => {
      if (!helpers.isQueryInitialized()) {
        throw new Error('Cache not initialized')
      }
      
      await helpers.addToCache({
        item: user,
        placement: 'start'
      })
      
      return user
    })
  }
  
  return { addUserWithRetry }
}
```

## Performance Optimizations

### Batch Operations

```typescript
const useBatchOperations = () => {
  const helpers = useTanstackCacheHelpers<User>(['users'])
  
  const batchUpdateUsers = async (updates: User[]) => {
    if (!helpers.isQueryInitialized()) {
      throw new Error('Cache not initialized')
    }
    
    // Group updates by operation type
    const operations = updates.map(user =>
      helpers.updateItem({
        item: user,
        identityKey: 'id'
      })
    )
    
    // Execute all operations in parallel
    await Promise.all(operations)
  }
  
  const batchAddUsers = async (users: User[]) => {
    if (!helpers.isQueryInitialized()) {
      throw new Error('Cache not initialized')
    }
    
    // Use refreshCache for better performance with multiple additions
    const existingUsers = users.value || []
    await helpers.refreshCache({
      items: [...existingUsers, ...users],
      identityKey: 'id',
      newItemsLocation: 'back'
    })
  }
  
  return { batchUpdateUsers, batchAddUsers }
}
```

### Debounced Updates

```typescript
import { debounce } from 'lodash-es'

const useDebouncedCacheOperations = () => {
  const helpers = useTanstackCacheHelpers<User>(['users'])
  
  const debouncedUpdateUser = debounce(async (user: User) => {
    if (helpers.isQueryInitialized()) {
      await helpers.updateItem({
        item: user,
        identityKey: 'id'
      })
    }
  }, 300) // 300ms delay
  
  const debouncedAddUser = debounce(async (user: User) => {
    if (helpers.isQueryInitialized()) {
      await helpers.addToCache({
        item: user,
        placement: 'start'
      })
    }
  }, 500) // 500ms delay
  
  return { debouncedUpdateUser, debouncedAddUser }
}
```

### Virtual Scrolling with Cache Management

```typescript
const useVirtualScrollingCache = () => {
  const helpers = useTanstackCacheHelpers<User>(['users'])
  const visibleItems = ref<User[]>([])
  const totalItems = ref(0)
  
  const loadVisibleItems = async (startIndex: number, endIndex: number) => {
    // Load items for visible range
    const items = await fetchUsersRange(startIndex, endIndex)
    
    // Update cache with new items
    if (helpers.isQueryInitialized()) {
      await helpers.refreshCache({
        items: items.data,
        identityKey: 'id',
        newItemsLocation: 'back'
      })
    }
    
    // Update visible items
    visibleItems.value = items.data
    totalItems.value = items.total
  }
  
  const updateVisibleItem = async (index: number, user: User) => {
    if (helpers.isQueryInitialized()) {
      await helpers.updateItem({
        item: user,
        identityKey: 'id'
      })
      
      // Update visible items array
      if (visibleItems.value[index]) {
        visibleItems.value[index] = user
      }
    }
  }
  
  return { loadVisibleItems, updateVisibleItem, visibleItems, totalItems }
}
```

## Integration with TanStack Query Mutations

### Mutation Integration Pattern

```typescript
const useUserMutations = () => {
  const helpers = useTanstackCacheHelpers<User>(['users'])
  
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onMutate: async (newUser) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] })
      
      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['users'])
      
      // Optimistically update
      await helpers.addToCache({
        item: { id: Date.now(), ...newUser },
        placement: 'start'
      })
      
      return { previousUsers }
    },
    onError: (err, newUser, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
  
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      
      const previousUsers = queryClient.getQueryData(['users'])
      
      await helpers.updateItem({
        item: updatedUser,
        identityKey: 'id'
      })
      
      return { previousUsers }
    },
    onError: (err, updatedUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    }
  })
  
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      
      const previousUsers = queryClient.getQueryData(['users'])
      
      await helpers.removeItem({
        target: userId,
        identityKey: 'id'
      })
      
      return { previousUsers }
    },
    onError: (err, userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    }
  })
  
  return {
    createUserMutation,
    updateUserMutation,
    deleteUserMutation
  }
}
```

## Custom Composables

### Reusable Cache Management

```typescript
const useCacheManager = <T extends object>(queryKey: QueryKey) => {
  const helpers = useTanstackCacheHelpers<T>(queryKey)
  
  const addItem = async (item: T, placement: 'start' | 'back' = 'start') => {
    if (!helpers.isQueryInitialized()) {
      throw new Error('Cache not initialized')
    }
    
    await helpers.addToCache({ item, placement })
    return item
  }
  
  const updateItem = async (item: T, identityKey: keyof T = 'id' as keyof T) => {
    if (!helpers.isQueryInitialized()) {
      throw new Error('Cache not initialized')
    }
    
    await helpers.updateItem({ item, identityKey })
    return item
  }
  
  const removeItem = async (target: number | string, identityKey: keyof T = 'id' as keyof T) => {
    if (!helpers.isQueryInitialized()) {
      throw new Error('Cache not initialized')
    }
    
    await helpers.removeItem({ target, identityKey })
  }
  
  const refreshItems = async (items: T[], identityKey: keyof T = 'id' as keyof T) => {
    if (!helpers.isQueryInitialized()) {
      throw new Error('Cache not initialized')
    }
    
    await helpers.refreshCache({ items, identityKey })
  }
  
  const clearAll = async () => {
    if (helpers.isQueryInitialized()) {
      await helpers.clearCache()
    }
  }
  
  return {
    addItem,
    updateItem,
    removeItem,
    refreshItems,
    clearAll,
    isInitialized: helpers.isQueryInitialized
  }
}

// Usage
const userCache = useCacheManager<User>(['users'])
const productCache = useCacheManager<Product>(['products'])
```

## Testing Patterns

### Mock Cache Helpers for Testing

```typescript
// test-utils/cache-helpers.ts
export const createMockCacheHelpers = () => {
  const mockCache = ref<any[]>([])
  
  return {
    addToCache: vi.fn(async (options: any) => {
      const { item, placement = 'start' } = options
      if (placement === 'start') {
        mockCache.value.unshift(item)
      } else {
        mockCache.value.push(item)
      }
    }),
    
    updateItem: vi.fn(async (options: any) => {
      const { item, identityKey = 'id' } = options
      const index = mockCache.value.findIndex(i => i[identityKey] === item[identityKey])
      if (index !== -1) {
        mockCache.value[index] = item
      }
    }),
    
    removeItem: vi.fn(async (options: any) => {
      const { target, identityKey = 'id' } = options
      const targets = Array.isArray(target) ? target : [target]
      mockCache.value = mockCache.value.filter(item => 
        !targets.includes(item[identityKey])
      )
    }),
    
    isQueryInitialized: vi.fn(() => mockCache.value.length > 0),
    
    // For testing
    getMockCache: () => mockCache.value,
    clearMockCache: () => { mockCache.value = [] }
  }
}
```

## Best Practices Summary

1. **Optimistic Updates**: Provide immediate feedback, but always handle rollbacks
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Performance**: Use batch operations and debouncing for better performance
4. **Testing**: Mock cache helpers for reliable unit tests
5. **Type Safety**: Leverage TypeScript for compile-time safety
6. **Composables**: Create reusable cache management composables
7. **Integration**: Properly integrate with TanStack Query mutations
8. **Monitoring**: Add logging and monitoring for production debugging
