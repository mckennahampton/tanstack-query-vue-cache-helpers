# Getting Started

## What is TanStack Query Cache Helpers?

TanStack Query Cache Helpers is a library that provides efficient cache mutation utilities for TanStack Query. Instead of the standard approach of invalidating entire caches when data changes, this library allows you to update only the affected records in the cache, leading to better performance and user experience.

### The Problem

When using TanStack Query, the typical pattern for handling data mutations is:

```typescript
// After creating/updating/deleting a record
queryClient.invalidateQueries({ queryKey: ['users'] })
// This refetches ALL users, even though only one changed
```

This approach:
- ❌ Refetches unnecessary data
- ❌ Causes loading states for unchanged data
- ❌ Increases network requests
- ❌ Slows down the UI

### The Solution

With TanStack Query Cache Helpers, you can efficiently update your cache using the response from your mutation API calls:

```typescript
// After creating a new user
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({ 
      item: response.data, 
      placement: 'start' 
    })
  }
})

// After updating a user
const updateUserMutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (response) => {
    helpers.updateItem({ 
      item: response.data, 
      identityKey: 'id' 
    })
  }
})

// After deleting a user
const deleteUserMutation = useMutation({
  mutationFn: deleteUser,
  onSuccess: (_, variables) => {
    helpers.removeItem({ 
      target: variables.userId, 
      identityKey: 'id' 
    })
  }
})
```

This approach:
- ✅ Updates only the changed data
- ✅ Maintains cache consistency
- ✅ Reduces network requests
- ✅ Provides instant UI updates
- ✅ Uses real server data for cache updates

## Installation

### Prerequisites

- Vue 3.x or React 18.x
- TanStack Query v5.x

### Install the Package

**For Vue:**
```bash
npm install @tanstack-query-cache-helpers/vue
# or
yarn add @tanstack-query-cache-helpers/vue
# or
pnpm add @tanstack-query-cache-helpers/vue
```

**For React:**
```bash
npm install @tanstack-query-cache-helpers/react
# or
yarn add @tanstack-query-cache-helpers/react
# or
pnpm add @tanstack-query-cache-helpers/react
```

## Basic Usage

```typescript
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/vue'
import { useQuery, useMutation } from '@tanstack/vue-query'

interface User {
  id: number
  name: string
  email: string
}

const queryKey = ['users']
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

const helpers = useTanstackCacheHelpers<User>(queryKey)

// Create user mutation
const createUserMutation = useMutation({
  mutationFn: (vars) => asyncCreateFunction(vars),
  onSuccess: (response) => {
    // Add the new user from the API response to the cache
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
  }
})

// Update user mutation
const updateUserMutation = useMutation({
  mutationFn: (vars) => asyncUpdateFunction(vars),
  onSuccess: (response) => {
    // Update the user in cache with the API response
    helpers.updateItem({
      item: response.data,
      identityKey: 'id'
    })
  }
})

// Delete user mutation
const deleteUserMutation = useMutation({
  mutationFn: (userId) => asyncDeleteFunction(userId),
  onSuccess: (response, userId) => {
    // Remove the user from cache using the deleted user ID
    helpers.removeItem({
      target: userId,
      identityKey: 'id'
    })
  }
})
```

## TypeScript Support

The library is fully typed and provides excellent TypeScript support for both Vue and React:

## Next Steps

- Check out the [API Reference](/api/) for detailed documentation of all available functions
- Explore [Examples](/examples/) to see real-world usage patterns
- Learn about [Advanced Patterns](/examples/advanced-patterns) for complex scenarios
