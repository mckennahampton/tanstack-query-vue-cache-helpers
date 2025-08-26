# Basic Operations

This page demonstrates the fundamental cache operations available in TanStack Query Cache Helpers.

## Setup

First, let's set up our basic structure:

### Vue Setup

```typescript
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/vue'
import { useQuery, useMutation } from '@tanstack/vue-query'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

const queryKey = ['users'] as const
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

const helpers = useTanstackCacheHelpers<User>(queryKey)
```

### React Setup

```typescript
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/react'
import { useQuery, useMutation } from '@tanstack/react-query'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

const queryKey = ['users'] as const
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

const helpers = useTanstackCacheHelpers<User>(queryKey)
```

## Adding Items to Cache

### Using onSuccess Callback (Recommended)

```typescript
// Vue
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    // Add the new user from the API response to the cache
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
    // Add the new user from the API response to the cache
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
  }
})
```

### Adding to End of Cache

```typescript
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    // Add to the end of the cache
    helpers.addToCache({
      item: response.data,
      placement: 'back'
    })
  }
})
```

### Handling Different Response Formats

```typescript
// If your API returns { data: User }
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
  }
})

// If your API returns User directly
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (user) => {
    helpers.addToCache({
      item: user,
      placement: 'start'
    })
  }
})

// If your API returns { user: User }
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({
      item: response.user,
      placement: 'start'
    })
  }
})
```

## Updating Items in Cache

### Basic Update Operation

```typescript
const updateUserMutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (response) => {
    // Update the user in cache with the API response
    helpers.updateItem({
      item: response.data,
      identityKey: 'id'
    })
  }
})
```

### Update with Custom Identity Key

```typescript
// If your items use a different identity key
interface Product {
  sku: string
  name: string
  price: number
}

const productHelpers = useTanstackCacheHelpers<Product>(['products'])

const updateProductMutation = useMutation({
  mutationFn: updateProduct,
  onSuccess: (response) => {
    productHelpers.updateItem({
      item: response.data,
      identityKey: 'sku' // Use SKU as identity key
    })
  }
})
```

### Batch Updates

```typescript
const batchUpdateUsersMutation = useMutation({
  mutationFn: batchUpdateUsers,
  onSuccess: (response) => {
    // Update multiple users from the API response
    response.data.forEach(user => {
      helpers.updateItem({
        item: user,
        identityKey: 'id'
      })
    })
  }
})
```

## Removing Items from Cache

### Remove Single Item

```typescript
const deleteUserMutation = useMutation({
  mutationFn: deleteUser,
  onSuccess: (_, variables) => {
    // Remove the user from cache using the deleted user ID
    helpers.removeItem({
      target: variables.userId,
      identityKey: 'id'
    })
  }
})
```

### Remove Multiple Items

```typescript
const deleteMultipleUsersMutation = useMutation({
  mutationFn: deleteMultipleUsers,
  onSuccess: (_, variables) => {
    // Remove multiple users from cache
    helpers.removeItem({
      target: variables.userIds,
      identityKey: 'id'
    })
  }
})
```

### Remove by String ID

```typescript
// If your IDs are strings
interface Category {
  slug: string
  name: string
  description: string
}

const categoryHelpers = useTanstackCacheHelpers<Category>(['categories'])

const deleteCategoryMutation = useMutation({
  mutationFn: deleteCategory,
  onSuccess: (_, variables) => {
    categoryHelpers.removeItem({
      target: variables.slug,
      identityKey: 'slug'
    })
  }
})
```

## Clearing the Cache

### Clear Entire Cache

```typescript
const clearUsersMutation = useMutation({
  mutationFn: clearUsers,
  onSuccess: () => {
    // Clear all users from the cache
    helpers.clearCache()
  }
})
```

### Conditional Clear

```typescript
const clearUsersMutation = useMutation({
  mutationFn: clearUsers,
  onSuccess: () => {
    // Clear cache only if it exists
    if (helpers.isQueryInitialized()) {
      helpers.clearCache()
    }
  }
})
```

## Refreshing Cache

### Replace Entire Cache

```typescript
const refreshUsersMutation = useMutation({
  mutationFn: refreshUsers,
  onSuccess: (response) => {
    // Replace all cache data with new data from API
    helpers.refreshCache({
      items: response.data,
      identityKey: 'id',
      newItemsLocation: 'front'
    })
  }
})
```

### Refresh with Custom Find Function

```typescript
const refreshUsersMutation = useMutation({
  mutationFn: refreshUsers,
  onSuccess: (response) => {
    // Use custom logic to find matching items
    helpers.refreshCache({
      items: response.data,
      identityKey: 'id',
      findFn: (cacheItem, newItem) => {
        // Custom matching logic
        return cacheItem.email === newItem.email
      }
    })
  }
})
```

## Checking Cache Status

### Is Cache Initialized

```typescript
const safeAddUser = async (userData: Omit<User, 'id'>) => {
  if (helpers.isQueryInitialized()) {
    console.log('Cache is ready for operations')
    // Proceed with mutation
    createUserMutation.mutate(userData)
  } else {
    console.log('Cache is not initialized yet')
  }
}
```

## Complete Example Components

### Vue Component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/vue'
import { useQuery, useMutation } from '@tanstack/vue-query'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

const queryKey = ['users']
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

const helpers = useTanstackCacheHelpers<User>(queryKey)

// Form data
const newUser = ref<Omit<User, 'id'>>({
  name: '',
  email: '',
  role: 'user'
})

// Mutations
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
    // Reset form
    newUser.value = { name: '', email: '', role: 'user' }
  }
})

const updateUserMutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (response) => {
    helpers.updateItem({
      item: response.data,
      identityKey: 'id'
    })
  }
})

const deleteUserMutation = useMutation({
  mutationFn: deleteUser,
  onSuccess: (_, variables) => {
    helpers.removeItem({
      target: variables.userId,
      identityKey: 'id'
    })
  }
})

const clearAllUsersMutation = useMutation({
  mutationFn: clearAllUsers,
  onSuccess: () => {
    if (helpers.isQueryInitialized()) {
      helpers.clearCache()
    }
  }
})

// Actions
const addUser = () => {
  createUserMutation.mutate(newUser.value)
}

const updateUser = (user: User) => {
  updateUserMutation.mutate({ ...user, role: user.role === 'user' ? 'admin' : 'user' })
}

const deleteUser = (userId: number) => {
  deleteUserMutation.mutate({ userId })
}

const clearAllUsers = () => {
  clearAllUsersMutation.mutate()
}
</script>

<template>
  <div>
    <h2>User Management</h2>
    
    <!-- Add User Form -->
    <div class="add-user-form">
      <input v-model="newUser.name" placeholder="Name" />
      <input v-model="newUser.email" placeholder="Email" />
      <select v-model="newUser.role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button @click="addUser" :disabled="createUserMutation.isPending">
        {{ createUserMutation.isPending ? 'Adding...' : 'Add User' }}
      </button>
    </div>
    
    <!-- User List -->
    <div class="user-list">
      <div v-for="user in users" :key="user.id" class="user-item">
        <span>{{ user.name }} ({{ user.email }})</span>
        <span class="role">{{ user.role }}</span>
        <button @click="updateUser(user)" :disabled="updateUserMutation.isPending">
          Toggle Role
        </button>
        <button @click="deleteUser(user.id)" :disabled="deleteUserMutation.isPending">
          Delete
        </button>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="actions">
      <button @click="clearAllUsers" :disabled="clearAllUsersMutation.isPending">
        Clear All Users
      </button>
    </div>
  </div>
</template>
```

### React Component

```tsx
import { useState } from 'react'
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/react'
import { useQuery, useMutation } from '@tanstack/react-query'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

const queryKey = ['users']
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

const helpers = useTanstackCacheHelpers<User>(queryKey)

// Form state
const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
  name: '',
  email: '',
  role: 'user'
})

// Mutations
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    helpers.addToCache({
      item: response.data,
      placement: 'start'
    })
    // Reset form
    setNewUser({ name: '', email: '', role: 'user' })
  }
})

const updateUserMutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (response) => {
    helpers.updateItem({
      item: response.data,
      identityKey: 'id'
    })
  }
})

const deleteUserMutation = useMutation({
  mutationFn: deleteUser,
  onSuccess: (_, variables) => {
    helpers.removeItem({
      target: variables.userId,
      identityKey: 'id'
    })
  }
})

const clearAllUsersMutation = useMutation({
  mutationFn: clearAllUsers,
  onSuccess: () => {
    if (helpers.isQueryInitialized()) {
      helpers.clearCache()
    }
  }
})

// Actions
const addUser = () => {
  createUserMutation.mutate(newUser)
}

const updateUser = (user: User) => {
  updateUserMutation.mutate({ ...user, role: user.role === 'user' ? 'admin' : 'user' })
}

const deleteUser = (userId: number) => {
  deleteUserMutation.mutate({ userId })
}

const clearAllUsers = () => {
  clearAllUsersMutation.mutate()
}

return (
  <div>
    <h2>User Management</h2>
    
    {/* Add User Form */}
    <div className="add-user-form">
      <input 
        value={newUser.name}
        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Name" 
      />
      <input 
        value={newUser.email}
        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email" 
      />
      <select 
        value={newUser.role}
        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={addUser} disabled={createUserMutation.isPending}>
        {createUserMutation.isPending ? 'Adding...' : 'Add User'}
      </button>
    </div>
    
    {/* User List */}
    <div className="user-list">
      {users?.map(user => (
        <div key={user.id} className="user-item">
          <span>{user.name} ({user.email})</span>
          <span className="role">{user.role}</span>
          <button 
            onClick={() => updateUser(user)} 
            disabled={updateUserMutation.isPending}
          >
            Toggle Role
          </button>
          <button 
            onClick={() => deleteUser(user.id)} 
            disabled={deleteUserMutation.isPending}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
    
    {/* Actions */}
    <div className="actions">
      <button 
        onClick={clearAllUsers} 
        disabled={clearAllUsersMutation.isPending}
      >
        Clear All Users
      </button>
    </div>
  </div>
)
```

## Best Practices

1. **Use onSuccess callbacks**: Always use cache helpers in mutation `onSuccess` callbacks
2. **Use server data**: Use the actual API response data, not optimistic data
3. **Handle different response formats**: Adapt to your API's response structure
4. **Use variables for deletes**: Use mutation variables for delete operations
5. **Check initialization**: Verify cache is initialized before operations
6. **Type safety**: Leverage TypeScript for compile-time safety
