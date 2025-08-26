# Deep Operations

This page demonstrates advanced cache operations for complex nested data structures.

## Setup

Let's set up our complex data structures:

```typescript
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/vue'
import { useQuery } from '@tanstack/vue-query'

interface Comment {
  id: number
  text: string
  authorId: number
  createdAt: string
  likes: number
}

interface Post {
  id: number
  title: string
  content: string
  authorId: number
  comments: Comment[]
  tags: string[]
  metadata: {
    views: number
    shares: number
    bookmarks: number
  }
}

interface User {
  id: number
  name: string
  email: string
  posts: Post[]
  profile: {
    bio: string
    avatar: string
    social: {
      twitter: string
      github: string
    }
  }
}

const queryKey = ['users'] as const
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

const helpers = useTanstackCacheHelpers<User, Post>(queryKey)
```

## Deep Item Operations

### `refreshDeepItem` - Update Nested Objects

This function updates nested items within cache objects.

#### Update User's Posts

```typescript
// Update a user's posts array
await helpers.refreshDeepItem({
  item: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    posts: [
      {
        id: 1,
        title: 'Updated Post Title',
        content: 'Updated content',
        authorId: 1,
        comments: [],
        tags: ['updated', 'post'],
        metadata: { views: 100, shares: 10, bookmarks: 5 }
      }
    ],
    profile: {
      bio: 'Developer',
      avatar: 'avatar.jpg',
      social: { twitter: '@johndoe', github: 'johndoe' }
    }
  },
  childKey: 'posts',
  parentKey: 'id',
  identityKey: 'id'
})
```

#### Update with Custom Find Function

```typescript
// Use custom logic to find the parent item
await helpers.refreshDeepItem({
  item: userWithUpdatedPosts,
  childKey: 'posts',
  parentKey: 'id',
  findFn: (cacheItem, newItem) => {
    // Find by email instead of ID
    return cacheItem.email === newItem.email
  }
})
```

### `removeDeepItem` - Remove Nested Items

This function removes nested items from cache objects.

#### Remove Post from User

```typescript
// Remove a specific post from a user
await helpers.removeDeepItem({
  targetKeyValue: 1, // User ID
  childKey: 'posts',
  parentKey: 'id',
  identityKey: 'id'
})
```

#### Remove by Custom Identifier

```typescript
// Remove post by title instead of ID
await helpers.removeDeepItem({
  targetKeyValue: 'My Post Title', // Post title
  childKey: 'posts',
  parentKey: 'title',
  identityKey: 'id'
})
```

## Partial Item Operations

### `refreshPartialItem` - Update Specific Properties

This function updates specific properties of cache items.

#### Update User's Profile

```typescript
// Update a user's profile information
await helpers.refreshPartialItem({
  targetKeyValue: 1, // User ID
  identityKey: 'id',
  updateKey: 'profile',
  updatedContent: {
    bio: 'Updated bio text',
    avatar: 'new-avatar.jpg',
    social: {
      twitter: '@updatedhandle',
      github: 'updatedusername'
    }
  },
  treatArrayAsObject: true // Treat profile as object, not array
})
```

#### Update User's Posts Array

```typescript
// Add a new post to user's posts array
await helpers.refreshPartialItem({
  targetKeyValue: 1, // User ID
  identityKey: 'id',
  updateKey: 'posts',
  updatedContent: {
    id: 5,
    title: 'New Post',
    content: 'New post content',
    authorId: 1,
    comments: [],
    tags: ['new'],
    metadata: { views: 0, shares: 0, bookmarks: 0 }
  },
  updatedItemsIdentityKey: 'id'
})
```

#### Update Nested Object Properties

```typescript
// Update post metadata
await helpers.refreshPartialItem({
  targetKeyValue: 1, // User ID
  identityKey: 'id',
  updateKey: 'posts',
  updatedContent: {
    id: 1,
    title: 'Existing Post',
    content: 'Existing content',
    authorId: 1,
    comments: [],
    tags: ['existing'],
    metadata: { views: 150, shares: 15, bookmarks: 8 } // Updated metadata
  },
  updatedItemsIdentityKey: 'id'
})
```

#### Update with Debug Mode

```typescript
// Enable debug logging to see what's happening
await helpers.refreshPartialItem({
  targetKeyValue: 1,
  identityKey: 'id',
  updateKey: 'posts',
  updatedContent: newPost,
  updatedItemsIdentityKey: 'id',
  debug: true // Enable debug logging
})
```

#### Update with Custom Find Functions

```typescript
// Use custom logic to find items
await helpers.refreshPartialItem({
  targetKeyValue: 1,
  identityKey: 'id',
  updateKey: 'posts',
  updatedContent: newPost,
  updatedItemsIdentityKey: 'id',
  findFn: (cacheItem, targetValue) => {
    // Find user by email instead of ID
    return cacheItem.email === targetValue
  },
  subItemFindFn: (subItem, newItem) => {
    // Find post by title instead of ID
    return subItem.title === newItem.title
  }
})
```

### `removeSubItem` - Remove Items from Nested Arrays

This function removes specific items from nested arrays.

#### Remove Comment from Post

```typescript
// Remove a specific comment from a user's post
await helpers.removeSubItem({
  targetKeyValue: 1, // User ID
  identityKey: 'id',
  subItemsKey: 'posts',
  removalKeyValue: 1, // Post ID
  removalKey: 'id'
})
```

#### Remove Tag from Post

```typescript
// Remove a specific tag from a post
await helpers.removeSubItem({
  targetKeyValue: 1, // User ID
  identityKey: 'id',
  subItemsKey: 'posts',
  removalKeyValue: 'javascript', // Tag to remove
  removalKey: 'tags'
})
```

## Complex Scenarios

### Blog Management System

```typescript
// Complete blog management example
const blogHelpers = useTanstackCacheHelpers<User, Post>(['blog-users'])

// Add a new post to a user
const addPostToUser = async (userId: number, post: Post) => {
  await blogHelpers.refreshPartialItem({
    targetKeyValue: userId,
    identityKey: 'id',
    updateKey: 'posts',
    updatedContent: post,
    updatedItemsIdentityKey: 'id'
  })
}

// Add a comment to a post
const addCommentToPost = async (userId: number, postId: number, comment: Comment) => {
  // First, get the current post
  const user = users.value?.find(u => u.id === userId)
  const post = user?.posts.find(p => p.id === postId)
  
  if (post) {
    const updatedPost = {
      ...post,
      comments: [...post.comments, comment]
    }
    
    await blogHelpers.refreshPartialItem({
      targetKeyValue: userId,
      identityKey: 'id',
      updateKey: 'posts',
      updatedContent: updatedPost,
      updatedItemsIdentityKey: 'id'
    })
  }
}

// Update post metadata
const updatePostViews = async (userId: number, postId: number, views: number) => {
  const user = users.value?.find(u => u.id === userId)
  const post = user?.posts.find(p => p.id === postId)
  
  if (post) {
    const updatedPost = {
      ...post,
      metadata: { ...post.metadata, views }
    }
    
    await blogHelpers.refreshPartialItem({
      targetKeyValue: userId,
      identityKey: 'id',
      updateKey: 'posts',
      updatedContent: updatedPost,
      updatedItemsIdentityKey: 'id'
    })
  }
}
```

### E-commerce Product Management

```typescript
interface Product {
  id: number
  name: string
  price: number
  category: {
    id: number
    name: string
  }
  variants: {
    id: number
    size: string
    color: string
    stock: number
  }[]
  reviews: {
    id: number
    rating: number
    comment: string
    userId: number
  }[]
}

const productHelpers = useTanstackCacheHelpers<Product>(['products'])

// Add a new variant to a product
const addProductVariant = async (productId: number, variant: any) => {
  await productHelpers.refreshPartialItem({
    targetKeyValue: productId,
    identityKey: 'id',
    updateKey: 'variants',
    updatedContent: variant,
    updatedItemsIdentityKey: 'id'
  })
}

// Update product stock
const updateProductStock = async (productId: number, variantId: number, stock: number) => {
  const product = products.value?.find(p => p.id === productId)
  const variant = product?.variants.find(v => v.id === variantId)
  
  if (variant) {
    const updatedVariant = { ...variant, stock }
    const updatedProduct = {
      ...product,
      variants: product.variants.map(v => v.id === variantId ? updatedVariant : v)
    }
    
    await productHelpers.updateItem({
      item: updatedProduct,
      identityKey: 'id'
    })
  }
}

// Add a review to a product
const addProductReview = async (productId: number, review: any) => {
  await productHelpers.refreshPartialItem({
    targetKeyValue: productId,
    identityKey: 'id',
    updateKey: 'reviews',
    updatedContent: review,
    updatedItemsIdentityKey: 'id'
  })
}
```

## Complete Example Component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useTanstackCacheHelpers } from '@tanstack-query-cache-helpers/vue'
import { useQuery } from '@tanstack/vue-query'

interface Comment {
  id: number
  text: string
  authorId: number
}

interface Post {
  id: number
  title: string
  content: string
  comments: Comment[]
}

interface User {
  id: number
  name: string
  posts: Post[]
}

const queryKey = ['users']
const { data: users } = useQuery({
  queryKey,
  queryFn: () => fetchUsers()
})

const helpers = useTanstackCacheHelpers<User, Post>(queryKey)

// Form data
const newPost = ref<Omit<Post, 'id'>>({
  title: '',
  content: '',
  comments: []
})

const newComment = ref<Omit<Comment, 'id'>>({
  text: '',
  authorId: 1
})

// Operations
const addPostToUser = async (userId: number) => {
  if (helpers.isQueryInitialized()) {
    const post: Post = {
      id: Date.now(),
      ...newPost.value
    }
    
    await helpers.refreshPartialItem({
      targetKeyValue: userId,
      identityKey: 'id',
      updateKey: 'posts',
      updatedContent: post,
      updatedItemsIdentityKey: 'id'
    })
    
    newPost.value = { title: '', content: '', comments: [] }
  }
}

const addCommentToPost = async (userId: number, postId: number) => {
  if (helpers.isQueryInitialized()) {
    const comment: Comment = {
      id: Date.now(),
      ...newComment.value
    }
    
    const user = users.value?.find(u => u.id === userId)
    const post = user?.posts.find(p => p.id === postId)
    
    if (post) {
      const updatedPost = {
        ...post,
        comments: [...post.comments, comment]
      }
      
      await helpers.refreshPartialItem({
        targetKeyValue: userId,
        identityKey: 'id',
        updateKey: 'posts',
        updatedContent: updatedPost,
        updatedItemsIdentityKey: 'id'
      })
      
      newComment.value = { text: '', authorId: 1 }
    }
  }
}

const removePost = async (userId: number, postId: number) => {
  if (helpers.isQueryInitialized()) {
    await helpers.removeSubItem({
      targetKeyValue: userId,
      identityKey: 'id',
      subItemsKey: 'posts',
      removalKeyValue: postId,
      removalKey: 'id'
    })
  }
}
</script>

<template>
  <div>
    <h2>Blog Management</h2>
    
    <!-- Add Post Form -->
    <div class="add-post-form">
      <h3>Add Post to User</h3>
      <input v-model="newPost.title" placeholder="Post Title" />
      <textarea v-model="newPost.content" placeholder="Post Content" />
      <button @click="addPostToUser(1)">Add Post to User 1</button>
    </div>
    
    <!-- Add Comment Form -->
    <div class="add-comment-form">
      <h3>Add Comment to Post</h3>
      <input v-model="newComment.text" placeholder="Comment Text" />
      <button @click="addCommentToPost(1, 1)">Add Comment to Post 1</button>
    </div>
    
    <!-- User List with Posts -->
    <div class="user-list">
      <div v-for="user in users" :key="user.id" class="user-item">
        <h3>{{ user.name }}</h3>
        
        <div v-for="post in user.posts" :key="post.id" class="post-item">
          <h4>{{ post.title }}</h4>
          <p>{{ post.content }}</p>
          
          <div class="comments">
            <h5>Comments:</h5>
            <div v-for="comment in post.comments" :key="comment.id" class="comment">
              {{ comment.text }}
            </div>
          </div>
          
          <button @click="removePost(user.id, post.id)">Remove Post</button>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Best Practices for Deep Operations

1. **Use appropriate functions**: Choose the right function for your use case
2. **Handle complex updates carefully**: Deep operations can be complex, test thoroughly
3. **Use debug mode**: Enable debug logging when troubleshooting
4. **Custom find functions**: Use custom logic when standard matching isn't sufficient
5. **Batch related operations**: Group related deep operations together
6. **Error handling**: Always check if items exist before operations
7. **Performance**: Deep operations can be expensive, use them judiciously
