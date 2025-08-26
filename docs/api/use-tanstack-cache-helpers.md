# useTanstackCacheHelpers

The main composable that provides all cache manipulation functions for a specific query key.

## Signature

```typescript
function useTanstackCacheHelpers<T extends object, U extends object = any, TTaggedQueryKey extends QueryKey = QueryKey>(
  queryKey: TTaggedQueryKey
): {
  queryClient: QueryClient
  isQueryInitialized: () => boolean
  addToCache: (options: IAddToCache<T>) => Promise<void>
  updateItem: (options: IUpdateItem<T>) => Promise<void>
  clearCache: () => Promise<void>
  refreshCache: (options: IRefreshCache<T>) => Promise<void>
  refreshDeepItem: (options: IRefreshDeepItem<T>) => Promise<void>
  refreshPartialItem: (options: IRefreshPartialItem<T, U>) => Promise<void>
  removeDeepItem: (options: IRemoveDeepItem<T>) => Promise<void>
  removeItem: (options: IRemoveItem<T>) => Promise<void>
  removeSubItem: (options: IRemoveSubItem<T, U>) => Promise<void>
}
```

## Parameters

- `queryKey: TTaggedQueryKey` - The TanStack Query key for the cache to manipulate

## Generic Types

- `T extends object` - The type of items in the cache array
- `U extends object = any` - The type of sub-items (used for nested operations)
- `TTaggedQueryKey extends QueryKey = QueryKey` - The query key type

## Returns

An object containing the query client and all cache manipulation functions:

### `queryClient: QueryClient`
The TanStack Query client instance.

### `isQueryInitialized(): boolean`
Checks if the query cache is initialized and contains data.

### `addToCache(options: IAddToCache<T>): Promise<void>`
Adds a new item to the cache.

### `updateItem(options: IUpdateItem<T>): Promise<void>`
Updates an existing item in the cache.

### `removeItem(options: IRemoveItem<T>): Promise<void>`
Removes items from the cache.

### `refreshCache(options: IRefreshCache<T>): Promise<void>`
Refreshes the entire cache with new data.

### `clearCache(): Promise<void>`
Clears the entire cache.

### `refreshDeepItem(options: IRefreshDeepItem<T>): Promise<void>`
Updates nested items within cache objects.

### `removeDeepItem(options: IRemoveDeepItem<T>): Promise<void>`
Removes nested items from cache objects.

### `refreshPartialItem(options: IRefreshPartialItem<T, U>): Promise<void>`
Updates specific properties of cache items.

### `removeSubItem(options: IRemoveSubItem<T, U>): Promise<void>`
Removes items from nested arrays.

## Usage Examples

### Basic Setup

```typescript
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/vue'
import { useQuery } from '@tanstack/vue-query'

interface User {
  id: number
  name: string
  email: string
}

// Set up your query
const queryKey = ['users'] as const
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

// Initialize cache helpers
const helpers = useTanstackCacheHelpers<User>(queryKey)
```

### Type-Safe Operations

```typescript
// Add a new user
await helpers.addToCache({
  item: { id: 1, name: 'John Doe', email: 'john@example.com' },
  placement: 'start'
})

// Update an existing user
await helpers.updateItem({
  item: { id: 1, name: 'John Smith', email: 'john@example.com' },
  identityKey: 'id'
})

// Remove a user
await helpers.removeItem({
  target: 1,
  identityKey: 'id'
})
```

### Complex Data Structures

```typescript
interface Post {
  id: number
  title: string
  content: string
}

interface UserWithPosts {
  id: number
  name: string
  posts: Post[]
}

const helpers = useTanstackCacheHelpers<UserWithPosts, Post>(['users'])

// Add a post to a specific user
await helpers.refreshPartialItem({
  targetKeyValue: 1, // User ID
  identityKey: 'id',
  updateKey: 'posts',
  updatedContent: { id: 1, title: 'New Post', content: 'Content' },
  updatedItemsIdentityKey: 'id'
})
```

## Best Practices

1. **Type Safety**: Always provide proper TypeScript types for better development experience
2. **Query Key Consistency**: Use the same query key for both the query and cache helpers
3. **Error Handling**: Check if the query is initialized before performing operations
4. **Async Operations**: All cache operations are async, so use `await` when needed

```typescript
// Check if cache is initialized before operations
if (helpers.isQueryInitialized()) {
  await helpers.addToCache({ item: newUser })
}
```

## Integration with Vue Components

```vue
<script setup lang="ts">
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/vue'
import { useQuery } from '@tanstack/vue-query'

interface User {
  id: number
  name: string
}

const queryKey = ['users']
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

const helpers = useTanstackCacheHelpers<User>(queryKey)

const addUser = async (user: User) => {
  await helpers.addToCache({ item: user, placement: 'start' })
}

const updateUser = async (user: User) => {
  await helpers.updateItem({ item: user, identityKey: 'id' })
}

const deleteUser = async (userId: number) => {
  await helpers.removeItem({ target: userId, identityKey: 'id' })
}
</script>

<template>
  <div>
    <button @click="addUser({ id: 1, name: 'New User' })">Add User</button>
    <button @click="updateUser({ id: 1, name: 'Updated User' })">Update User</button>
    <button @click="deleteUser(1)">Delete User</button>
  </div>
</template>
```
