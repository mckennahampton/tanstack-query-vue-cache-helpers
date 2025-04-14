<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  custom_id: number
  name: string
  parent_key?: number
  children?: Item[]
}

const queryKey = ['UpdateNestedItemWithCustomFind'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () => Promise.resolve([
    { 
      custom_id: 100, 
      name: 'Parent', 
      children: [
        { custom_id: 200, name: 'Child', parent_key: 100 }
      ] 
    }
  ])
});

const updateChild = async () => {
  await helpers.refreshDeepItem({
    item: { custom_id: 200, name: 'Updated Child', parent_key: 100 },
    // Find the item using a custom findFn
    findFn: (cacheItem, newItem) => cacheItem.custom_id === newItem.custom_id,
    childKey: 'children',
    parentKey: 'parent_key'
  });
};

const moveChild = async () => {
  // Create a new parent
  await helpers.refreshCache({
    items: [
      { 
        custom_id: 300, 
        name: 'New Parent', 
        children: [] 
      }
    ]
  });
  
  // Move the child to the new parent
  await helpers.refreshDeepItem({
    item: { custom_id: 200, name: 'Moved Child', parent_key: 300 },
    findFn: (cacheItem, newItem) => cacheItem.custom_id === newItem.custom_id,
    childKey: 'children',
    parentKey: 'parent_key'
  });
};

defineExpose({ updateChild, moveChild, query, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    <h3>Data:</h3>
    <pre>{{ JSON.stringify(query.data, null, 2) }}</pre>
    
    <div class="controls">
      <button @click="updateChild">Update Child</button>
      <button @click="moveChild">Move Child to New Parent</button>
    </div>
  </div>
</template> 