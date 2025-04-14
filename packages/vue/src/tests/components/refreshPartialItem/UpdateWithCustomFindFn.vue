<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface SubItem {
  sub_id: number
  title: string
}

interface Item {
  custom_id: number
  name: string
  tags: SubItem[]
}

const queryKey = ['UpdatePartialItemWithCustomFind'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () => Promise.resolve([
    { 
      custom_id: 100, 
      name: 'Test Item', 
      tags: [
        { sub_id: 1, title: 'Tag 1' },
        { sub_id: 2, title: 'Tag 2' }
      ]
    }
  ])
});

// Example 1: Update with main findFn (find the parent item by custom criteria)
const updateItemName = async () => {
  helpers.refreshPartialItem({
    targetKeyValue: 100,
    updateKey: 'name',
    updatedContent: 'Updated Item Name',
    findFn: (cacheItem, targetValue) => {
      // cacheItem is an item from the cache array
      // targetValue is the raw targetKeyValue (100)
      console.log('updateItemName findFn', cacheItem.custom_id, targetValue);
      return cacheItem.custom_id === targetValue;
    }
  });
};

// Example 2: Update sub-item with both findFn and subItemFindFn
const updateTag = async () => {
  const updatedTag = { sub_id: 2, title: 'Updated Tag 2' };
  
  helpers.refreshPartialItem({
    targetKeyValue: 100,
    updateKey: 'tags',
    updatedContent: updatedTag,
    // Find the main item by custom criteria
    findFn: (cacheItem, targetValue) => {
      // cacheItem is an item from the cache array
      // targetValue is the raw targetKeyValue (100)
      console.log('updateTag findFn', cacheItem.custom_id, targetValue);
      return cacheItem.custom_id === targetValue;
    },
    // Find the sub-item by custom criteria
    subItemFindFn: (subItem, newItem) => {
      // subItem is each item in the existing tags array
      // newItem is the updatedTag { sub_id: 2, title: 'Updated Tag 2' }
      console.log('updateTag subItemFindFn', subItem.sub_id, newItem.sub_id);
      return subItem.sub_id === newItem.sub_id;
    }
  });
};

// Example 3: Add new tag to the array
const addNewTag = async () => {
  const newTag = { sub_id: 3, title: 'New Tag' };
  
  helpers.refreshPartialItem({
    targetKeyValue: 100,
    updateKey: 'tags',
    updatedContent: newTag,
    findFn: (cacheItem, targetValue) => {
      // cacheItem is an item from the cache array
      // targetValue is the raw targetKeyValue (100)
      console.log('addNewTag findFn', cacheItem.custom_id, targetValue);
      return cacheItem.custom_id === targetValue;
    },
    // Providing a subItemFindFn to correctly identify items by sub_id
    subItemFindFn: (existingTag, newItemTag) => {
      console.log('addNewTag subItemFindFn', existingTag.sub_id, newItemTag.sub_id);
      return existingTag.sub_id === newItemTag.sub_id;
    },
    // Explicitly specify the identity key for sub-items
    updatedItemsIdentityKey: 'sub_id'
  });
};

defineExpose({ updateItemName, updateTag, addNewTag, query, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    <div>{{ query.data }}</div>
  </div>
</template> 