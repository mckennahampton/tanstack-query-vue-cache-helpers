// vitest.setup.ts
// import { config } from '@vue/test-utils'
// import { vi } from 'vitest'
import { VueQueryPlugin, QueryClient } from './packages/vue/node_modules/@tanstack/vue-query'

// Create a global QueryClient for tests
global.queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // cacheTime: Infinity
      }
    }
  })

// Setup Vue Query global config
// vi.mock('@tanstack/vue-query', async (importOriginal) => {
//     //   const actual = await importOriginal();
//     const actual = await vi.importActual('@tanstack/vue-query')
//     return {
//         ...actual,
//         useQueryClient: vi.fn(() => global.queryClient),
//         useQuery: vi.fn(),
//         useMutation: vi.fn(),
//     };
// });

// Mock the array utility functions that are imported by the composable
// vi.mock('lib/utilities/arrays/arrays', () => ({
//   refreshArray: vi.fn((params) => {
//     const { array, newItems } = params
//     newItems.forEach(newItem => {
//       const index = array.findIndex(item => item.id === newItem.id)
//       if (index !== -1) {
//         array[index] = newItem
//       } else {
//         array.push(newItem)
//       }
//     })
//     return array
//   }),
//   findRecursive: vi.fn((params) => {
//     const { array, target, identityKey, childKey } = params
//     // Simple implementation for testing
//     for (const item of array.value) {
//       if (item[identityKey] === target) {
//         return item
//       }
//       if (item[childKey]) {
//         for (const child of item[childKey]) {
//           if (child[identityKey] === target) {
//             return child
//           }
//         }
//       }
//     }
//     return null
//   }),
//   insertDeepItem: vi.fn((params) => {
//     const { array, item, childKey, parentKey, identityKey } = params
//     // Simple implementation for testing
//     const parentId = item[parentKey]
//     for (const parent of array.value) {
//       if (parent[identityKey] === parentId) {
//         if (!parent[childKey]) {
//           parent[childKey] = []
//         }
//         parent[childKey].push(item)
//         return
//       }
//     }
//   }),
//   updateDeepItem: vi.fn((params) => {
//     const { array, item, childKey, parentKey, identityKey } = params
//     // Simple implementation for testing
//     const parentId = item[parentKey]
//     for (const parent of array.value) {
//       if (parent[identityKey] === parentId) {
//         const index = parent[childKey].findIndex(
//           child => child[identityKey] === item[identityKey]
//         )
//         if (index !== -1) {
//           parent[childKey][index] = item
//         }
//         return
//       }
//     }
//   }),
//   removeDeepItem: vi.fn((params) => {
//     const { array, oldItem, childKey, parentKey, identityKey } = params
//     // Simple implementation for testing
//     for (const parent of array.value) {
//       if (parent[childKey]) {
//         const index = parent[childKey].findIndex(
//           child => child[identityKey] === oldItem || 
//                   (typeof oldItem === 'object' && child[identityKey] === oldItem[identityKey])
//         )
//         if (index !== -1) {
//           parent[childKey].splice(index, 1)
//           return
//         }
//       }
//     }
//   }),
//   removeArrayItem: vi.fn((params) => {
//     const { array, identityValues, identityKey } = params
//     // Simple implementation for testing
//     let i = array.length
//     while (i--) {
//       if (identityValues.includes(array[i][identityKey])) {
//         array.splice(i, 1)
//       }
//     }
//     return array
//   })
// }))