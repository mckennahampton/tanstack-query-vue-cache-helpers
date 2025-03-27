<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  id: number
  name: string
  parentId?: number
  children?: Item[]
}

const queryKey = ['InsertNestedItem'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: 'Parent', children: [] }
  ])
});

const insertChild = async () => {
  await helpers.refreshDeepItem({
    item: { id: 2, name: 'New Child', parentId: 1 },
    childKey: 'children',
    parentKey: 'parentId'
  });
};

defineExpose({ insertChild, query, helpers });
</script>

<template>
  <div :key="JSON.stringify(query.data)">
    {{ query.data }}
  </div>
</template>
