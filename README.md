# TanStack Query Cache Helpers

Efficient cache mutations for TanStack Query - update only what changed, not everything.

## 🚀 Features

- **Efficient Cache Updates**: Add, update, or remove items from your TanStack Query cache without invalidating entire caches
- **Deep Object Operations**: Perform updates or removals on nested items deep within your cached data structures
- **Granular Control**: Refresh partial items, remove specific sub-items, or clear/refresh the entire cache for a query key
- **Framework Support**: Built for Vue 3 and React with TanStack Query v5, featuring proper reactivity, TypeScript support, and framework-specific optimizations
- **Framework Agnostic Core**: Core functionality is framework-agnostic, with Vue and React-specific implementations for seamless integration
- **Zero Dependencies**: Lightweight library with no additional dependencies beyond TanStack Query and your chosen framework

## 📖 Documentation

📚 **[View Full Documentation](https://your-docs-url.com)**

- [Getting Started](https://your-docs-url.com/getting-started)
- [API Reference](https://your-docs-url.com/api/)
- [Examples](https://your-docs-url.com/examples/)

## 🏗️ Architecture

```
@tanstack-query-cache-helpers/
├── core/          # Framework-agnostic core functions
├── vue/           # Vue-specific composables
└── react/         # React-specific hooks
```

## 🚀 Quick Start

### Installation

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

### Basic Usage

**Vue:**
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
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
  }
})

// Update user mutation
const updateUserMutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (response) => {
    helpers.updateItem({
      item: response.data,
      identityKey: 'id'
    })
  }
})

// Delete user mutation
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

**React:**
```typescript
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/react'
import { useQuery, useMutation } from '@tanstack/react-query'

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
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
  }
})

// Update user mutation
const updateUserMutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (response) => {
    helpers.updateItem({
      item: response.data,
      identityKey: 'id'
    })
  }
})

// Delete user mutation
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

## 🎯 Why Use Cache Helpers?

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

## 📦 Packages

- **`@tanstack-query-cache-helpers/core`**: Framework-agnostic core functions
- **`@tanstack-query-cache-helpers/vue`**: Vue-specific composables
- **`@tanstack-query-cache-helpers/react`**: React-specific hooks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [TanStack Query](https://tanstack.com/query)
- Inspired by the need for more efficient cache management patterns
- Thanks to the Vue.js, React, and TanStack communities for their excellent work
