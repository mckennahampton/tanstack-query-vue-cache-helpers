# Core Functions

This page documents all the core cache manipulation functions available through the `useTanstackCacheHelpers` composable.

## Basic Operations

### `addToCache`

Adds a new item to the cache array.

**Signature:**
```typescript
addToCache(options: IAddToCache<T>): Promise<void>
```

**Options:**
- `item: T` - The item to add to the cache
- `placement?: 'start' | 'back'` - Where to place the item (default: 'start')

**Example:**
```typescript
// Add to the beginning of the array
await helpers.addToCache({
  item: { id: 1, name: 'John Doe' },
  placement: 'start'
})

// Add to the end of the array
await helpers.addToCache({
  item: { id: 2, name: 'Jane Smith' },
  placement: 'back'
})
```
---

### `updateItem`

Updates an existing item in the cache by matching the identity key.

**Signature:**
```typescript
updateItem(options: IUpdateItem<T>): Promise<void>
```

**Options:**
- `item: T` - The updated item
- `identityKey?: keyof T` - The key to use for identifying the item (default: 'id')

**Example:**
```typescript
await helpers.updateItem({
  item: { id: 1, name: 'John Smith', email: 'john@example.com' },
  identityKey: 'id'
})
```
---

### `refreshCache`

Aggregate of **addToCache** & **updateCache**, updating existing items and adding new ones.

**Signature:**
```typescript
refreshCache(options: IRefreshCache<T>): Promise<void>
```

**Options:**
- `items: T[]` - Array of items to refresh the cache with
- `identityKey?: keyof T` - The key to use for identifying items (default: 'id')
- `newItemsLocation?: 'front' | 'back'` - Where to place new items (default: 'front')
- `findFn?: (cacheItem: T, newItem: T) => boolean` - Custom function to find matching items

**Example:**
```typescript
await helpers.refreshCache({
  items: [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ],
  identityKey: 'id',
  newItemsLocation: 'back'
})
```
---
### `removeItem`

Removes one or more items from the cache.

**Signature:**
```typescript
removeItem(options: IRemoveItem<T>): Promise<void>
```

**Options:**
- `target: number | number[] | string | string[]` - The ID(s) of the item(s) to remove
- `identityKey?: keyof T` - The key to use for identifying items (default: 'id')

**Example:**
```typescript
// Remove a single item
await helpers.removeItem({
  target: 1,
  identityKey: 'id'
})

// Remove multiple items
await helpers.removeItem({
  target: [1, 2, 3],
  identityKey: 'id'
})
```
---
### `clearCache`

Clears the entire cache for the query key.

**Signature:**
```typescript
clearCache(): Promise<void>
```

**Example:**
```typescript
await helpers.clearCache()
```

## Cache Management

### `isQueryInitialized`

Checks if the query cache is initialized and contains data.

**Signature:**
```typescript
isQueryInitialized(): boolean
```

**Example:**
```typescript
if (helpers.isQueryInitialized()) {
  await helpers.addToCache({ item: newUser })
}
```

## Deep Operations

### `refreshDeepItem`

Updates a nested item within a cached object.

**Signature:**
```typescript
refreshDeepItem(options: IRefreshDeepItem<T>): Promise<void>
```

**Options:**
- `item: T` - The item containing the updated nested data
- `childKey: keyof T` - The key of the nested array/object
- `parentKey: keyof T` - The key to identify the parent item
- `identityKey?: keyof T` - The key to use for identifying the parent item (default: 'id')
- `findFn?: (cacheItem: T, newItem: T) => boolean` - Custom function to find matching items

**Example:**
```typescript
// Update a user's posts
await helpers.refreshDeepItem({
  item: {
    id: 1,
    name: 'John Doe',
    posts: [
      { id: 1, title: 'Updated Post', content: 'New content' }
    ]
  },
  childKey: 'posts',
  parentKey: 'id',
  identityKey: 'id'
})
```

### `removeDeepItem`

Removes a nested item from a cache object.

**Signature:**
```typescript
removeDeepItem(options: IRemoveDeepItem<T>): Promise<void>
```

**Options:**
- `targetKeyValue: T | number` - The value to identify the parent item
- `childKey: keyof T` - The key of the nested array/object
- `parentKey: keyof T` - The key to identify the parent item
- `identityKey?: keyof T` - The key to use for identifying the parent item (default: 'id')

**Example:**
```typescript
// Remove a post from a user
await helpers.removeDeepItem({
  targetKeyValue: 1, // User ID
  childKey: 'posts',
  parentKey: 'id',
  identityKey: 'id'
})
```

### `refreshPartialItem`

Updates specific properties of a cache item.

**Signature:**
```typescript
refreshPartialItem<T, U>(options: IRefreshPartialItem<T, U>): Promise<void>
```

**Options:**
- `targetKeyValue: string | number` - The value to identify the target item
- `identityKey?: keyof T` - The key to use for identifying the target item (default: 'id')
- `updateKey: keyof T` - The key of the property to update
- `updatedContent: U` - The new content for the property
- `updatedItemsIdentityKey?: keyof U` - The key to use for identifying sub-items
- `treatArrayAsObject?: boolean` - Whether to treat the property as an object instead of an array
- `debug?: boolean` - Enable debug logging
- `findFn?: (cacheItem: T, targetValue: any) => boolean` - Custom function to find the target item
- `subItemFindFn?: (subItem: U, newItem: U) => boolean` - Custom function to find matching sub-items

**Example:**
```typescript
// Update a user's posts array
await helpers.refreshPartialItem({
  targetKeyValue: 1, // User ID
  identityKey: 'id',
  updateKey: 'posts',
  updatedContent: { id: 1, title: 'New Post', content: 'Content' },
  updatedItemsIdentityKey: 'id'
})

// Update a user's profile object
await helpers.refreshPartialItem({
  targetKeyValue: 1,
  identityKey: 'id',
  updateKey: 'profile',
  updatedContent: { bio: 'Updated bio', avatar: 'new-avatar.jpg' },
  treatArrayAsObject: true
})
```

### `removeSubItem`

Removes items from nested arrays within cache objects.

**Signature:**
```typescript
removeSubItem<T, U>(options: IRemoveSubItem<T, U>): Promise<void>
```

**Options:**
- `targetKeyValue: string | number` - The value to identify the parent item
- `identityKey?: keyof T` - The key to use for identifying the parent item (default: 'id')
- `subItemsKey: keyof T` - The key of the nested array
- `removalKeyValue: U[keyof U]` - The value to identify the sub-item to remove
- `removalKey?: keyof U` - The key to use for identifying the sub-item (default: 'id')

**Example:**
```typescript
// Remove a specific post from a user's posts
await helpers.removeSubItem({
  targetKeyValue: 1, // User ID
  identityKey: 'id',
  subItemsKey: 'posts',
  removalKeyValue: 5, // Post ID to remove
  removalKey: 'id'
})
```

## Error Handling

All functions handle the case where the query cache is not initialized:

- If the cache is not initialized, the function will log a warning and return early
- No errors are thrown, ensuring graceful degradation
- The `isQueryInitialized()` function can be used to check cache status before operations

## Performance Notes

- All operations are optimized for minimal re-renders
- Deep operations use efficient algorithms to minimize cache traversal
- Batch operations are supported for multiple updates
- Memory usage is optimized with proper cleanup
