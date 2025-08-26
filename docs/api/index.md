# API Reference

## Overview

TanStack Query Cache Helpers provides a comprehensive set of utilities for efficiently managing TanStack Query cache mutations. The library is built with a modular architecture:

- **Core Package**: Framework-agnostic cache manipulation functions
- **Vue Package**: Vue-specific composables that wrap the core functionality
- **React Package**: React-specific hooks that wrap the core functionality

## Architecture

```
@tanstack-query-cache-helpers/
├── core/          # Framework-agnostic core functions
├── vue/           # Vue-specific composables
└── react/         # React-specific hooks
```

## Main Functions

### Vue: `useTanstackCacheHelpers<T>(queryKey)`

The main composable that provides all cache manipulation functions for a specific query key.

```typescript
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/vue'

const helpers = useTanstackCacheHelpers<User>(['users'])
```

### React: `useTanstackCacheHelpers<T>(queryKey)`

The main hook that provides all cache manipulation functions for a specific query key.

```typescript
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/react'

const helpers = useTanstackCacheHelpers<User>(['users'])
```

**Returns:**
- `queryClient`: The TanStack Query client instance
- `isQueryInitialized()`: Check if the query cache is initialized
- `addToCache()`: Add items to the cache
- `updateItem()`: Update existing items in the cache
- `removeItem()`: Remove items from the cache
- `refreshCache()`: Refresh the entire cache with new data
- `clearCache()`: Clear the entire cache
- `refreshDeepItem()`: Update nested items within cache objects
- `removeDeepItem()`: Remove nested items from cache objects
- `refreshPartialItem()`: Update specific properties of cache items
- `removeSubItem()`: Remove items from nested arrays

## Recommended Usage Pattern

The best practice is to use cache helpers inside the `onSuccess` callback of your mutations:

```typescript
// Vue
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
  }
})

// React
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
  }
})
```

This ensures:
- **Real Data**: You're using the actual server response data
- **Consistency**: Cache stays in sync with the server
- **Error Handling**: Cache updates only happen on successful mutations

## Function Categories

### Basic Operations
- [addToCache](/api/core-functions#addtocache) - Add new items to the cache
- [updateItem](/api/core-functions#updateitem) - Update existing items
- [removeItem](/api/core-functions#removeitem) - Remove items from the cache
- [clearCache](/api/core-functions#clearcache) - Clear the entire cache

### Cache Management
- [refreshCache](/api/core-functions#refreshcache) - Replace cache with new data
- [isQueryInitialized](/api/core-functions#isqueryinitialized) - Check cache initialization

### Deep Operations
- [refreshDeepItem](/api/core-functions#refreshdeepitem) - Update nested objects
- [removeDeepItem](/api/core-functions#removedeepitem) - Remove nested objects
- [refreshPartialItem](/api/core-functions#refreshpartialitem) - Update specific properties
- [removeSubItem](/api/core-functions#removesubitem) - Remove items from nested arrays

## Type Definitions

All functions are fully typed with TypeScript interfaces. See the [Types](/api/types) page for detailed type definitions.

## Error Handling

The library handles common error scenarios:

- **Uninitialized Cache**: Functions gracefully handle cases where the query cache hasn't been initialized yet
- **Type Safety**: Full TypeScript support prevents runtime errors
- **Framework Integration**: Proper integration with Vue's reactivity system and React's state management

## Performance Considerations

- **Minimal Re-renders**: Only affected components re-render when cache changes
- **Efficient Updates**: Updates only the specific data that changed
- **Memory Management**: Proper cleanup and memory management
- **Batch Operations**: Support for batch updates when needed
