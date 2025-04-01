<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  id: number
  name: string
  parentId?: number
  children?: Item[]
}

const queryKey = ['UpdateNestedItem'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: 'Parent', children: [{ id: 2, name: 'Child', parentId: 1 }] }
  ])
});

const updateChild = async () => {
  await helpers.refreshDeepItem({
    item: { id: 2, name: 'Updated Child', parentId: 1 },
    childKey: 'children',
    parentKey: 'parentId'
  });
};

defineExpose({ updateChild, query, helpers });

// Without the JSON.stringify, Vue doesn't re-render the component due to not
// tracking the deep changes
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    {{ query.data }}
  </div>
</template>
