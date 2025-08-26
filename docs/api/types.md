# Types

This page documents all the TypeScript interfaces and types used in the TanStack Query Cache Helpers library.

## Core Interfaces

### `IAddToCache<T>`

Interface for adding items to the cache.

```typescript
interface IAddToCache<T> {
  item: T
  placement?: 'start' | 'back'
}
```

**Properties:**
- `item: T` - The item to add to the cache
- `placement?: 'start' | 'back'` - Where to place the item (default: 'start')

### `IUpdateItem<T>`

Interface for updating items in the cache.

```typescript
interface IUpdateItem<T> {
  item: T
  identityKey?: keyof T
}
```

**Properties:**
- `item: T` - The updated item
- `identityKey?: keyof T` - The key to use for identifying the item (default: 'id')

### `IRemoveItem<T>`

Interface for removing items from the cache.

```typescript
interface IRemoveItem<T> {
  target: number | number[] | string | string[]
  identityKey?: keyof T
}
```

**Properties:**
- `target: number | number[] | string | string[]` - The ID(s) of the item(s) to remove
- `identityKey?: keyof T` - The key to use for identifying items (default: 'id')

### `IRefreshCache<T>`

Interface for refreshing the entire cache.

```typescript
interface IRefreshCache<T> {
  items: T[]
  identityKey?: keyof T
  newItemsLocation?: 'front' | 'back'
  findFn?: (cacheItem: T, newItem: T) => boolean
}
```

**Properties:**
- `items: T[]` - Array of items to refresh the cache with
- `identityKey?: keyof T` - The key to use for identifying items (default: 'id')
- `newItemsLocation?: 'front' | 'back'` - Where to place new items (default: 'front')
- `findFn?: (cacheItem: T, newItem: T) => boolean` - Custom function to find matching items

## Deep Operation Interfaces

### `IRefreshDeepItem<T>`

Interface for updating nested items within cache objects.

```typescript
interface IRefreshDeepItem<T> {
  item: T
  childKey: keyof T
  parentKey: keyof T
  identityKey?: keyof T
  findFn?: (cacheItem: T, newItem: T) => boolean
}
```

**Properties:**
- `item: T` - The item containing the updated nested data
- `childKey: keyof T` - The key of the nested array/object
- `parentKey: keyof T` - The key to identify the parent item
- `identityKey?: keyof T` - The key to use for identifying the parent item (default: 'id')
- `findFn?: (cacheItem: T, newItem: T) => boolean` - Custom function to find matching items

### `IRemoveDeepItem<T>`

Interface for removing nested items from cache objects.

```typescript
interface IRemoveDeepItem<T> {
  targetKeyValue: T | number
  childKey: keyof T
  parentKey: keyof T
  identityKey?: keyof T
}
```

**Properties:**
- `targetKeyValue: T | number` - The value to identify the parent item
- `childKey: keyof T` - The key of the nested array/object
- `parentKey: keyof T` - The key to identify the parent item
- `identityKey?: keyof T` - The key to use for identifying the parent item (default: 'id')

### `IRefreshPartialItem<T, U>`

Interface for updating specific properties of cache items.

```typescript
interface IRefreshPartialItem<T, U> {
  targetKeyValue: string | number
  identityKey?: keyof T
  updateKey: keyof T
  updatedContent: U
  updatedItemsIdentityKey?: keyof U
  treatArrayAsObject?: boolean
  debug?: boolean
  findFn?: (cacheItem: T, targetValue: any) => boolean
  subItemFindFn?: (subItem: U, newItem: U) => boolean
}
```

**Properties:**
- `targetKeyValue: string | number` - The value to identify the target item
- `identityKey?: keyof T` - The key to use for identifying the target item (default: 'id')
- `updateKey: keyof T` - The key of the property to update
- `updatedContent: U` - The new content for the property
- `updatedItemsIdentityKey?: keyof U` - The key to use for identifying sub-items
- `treatArrayAsObject?: boolean` - Whether to treat the property as an object instead of an array
- `debug?: boolean` - Enable debug logging
- `findFn?: (cacheItem: T, targetValue: any) => boolean` - Custom function to find the target item
- `subItemFindFn?: (subItem: U, newItem: U) => boolean` - Custom function to find matching sub-items

### `IRemoveSubItem<T, U>`

Interface for removing items from nested arrays within cache objects.

```typescript
interface IRemoveSubItem<T, U> {
  targetKeyValue: string | number
  identityKey?: keyof T
  subItemsKey: keyof T
  removalKeyValue: U[keyof U]
  removalKey?: keyof U
}
```

**Properties:**
- `targetKeyValue: string | number` - The value to identify the parent item
- `identityKey?: keyof T` - The key to use for identifying the parent item (default: 'id')
- `subItemsKey: keyof T` - The key of the nested array
- `removalKeyValue: U[keyof U]` - The value to identify the sub-item to remove
- `removalKey?: keyof U` - The key to use for identifying the sub-item (default: 'id')

## Framework Integration

### `IFrameworkAdapter`

Interface for framework-specific adapters.

```typescript
interface IFrameworkAdapter {
  nextTick: () => Promise<void>
}
```

**Properties:**
- `nextTick: () => Promise<void>` - Framework-specific function to wait for the next tick

## Usage Examples

### Basic Type Definitions

```typescript
interface User {
  id: number
  name: string
  email: string
}

interface Post {
  id: number
  title: string
  content: string
  authorId: number
}

interface UserWithPosts {
  id: number
  name: string
  email: string
  posts: Post[]
}
```

### Type-Safe Cache Operations

```typescript
const helpers = useTanstackCacheHelpers<UserWithPosts, Post>(['users'])

// Add a new user
const addUserOptions: IAddToCache<UserWithPosts> = {
  item: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    posts: []
  },
  placement: 'start'
}

await helpers.addToCache(addUserOptions)

// Update a user
const updateUserOptions: IUpdateItem<UserWithPosts> = {
  item: {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    posts: []
  },
  identityKey: 'id'
}

await helpers.updateItem(updateUserOptions)

// Remove a user
const removeUserOptions: IRemoveItem<UserWithPosts> = {
  target: 1,
  identityKey: 'id'
}

await helpers.removeItem(removeUserOptions)
```

### Deep Operation Types

```typescript
// Refresh deep item
const refreshDeepOptions: IRefreshDeepItem<UserWithPosts> = {
  item: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    posts: [
      { id: 1, title: 'Updated Post', content: 'New content', authorId: 1 }
    ]
  },
  childKey: 'posts',
  parentKey: 'id',
  identityKey: 'id'
}

await helpers.refreshDeepItem(refreshDeepOptions)

// Refresh partial item
const refreshPartialOptions: IRefreshPartialItem<UserWithPosts, Post> = {
  targetKeyValue: 1,
  identityKey: 'id',
  updateKey: 'posts',
  updatedContent: { id: 1, title: 'New Post', content: 'Content', authorId: 1 },
  updatedItemsIdentityKey: 'id'
}

await helpers.refreshPartialItem(refreshPartialOptions)
```

## Generic Type Constraints

All interfaces use generic type constraints to ensure type safety:

- `T extends object` - Ensures the main item type is an object
- `U extends object = any` - Ensures sub-item types are objects (defaults to any)
- `keyof T` - Ensures identity keys are valid keys of the item type
- `U[keyof U]` - Ensures removal key values are valid values of the sub-item type

## Type Inference

The library provides excellent TypeScript inference:

```typescript
// TypeScript will infer the correct types based on usage
const helpers = useTanstackCacheHelpers<User>(['users'])

// This will be fully typed
const result = await helpers.addToCache({
  item: { id: 1, name: 'John' } // TypeScript knows this should be User
})
```