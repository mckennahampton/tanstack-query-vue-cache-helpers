<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  custom_id: number
  name: string
  parent_custom_id?: number
  children?: Item[]
}

const queryKey = ['UpdateNestedItemWithFindFn'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () => Promise.resolve([
    { custom_id: 1, name: 'Parent', children: [{ custom_id: 2, name: 'Child', parent_custom_id: 1 }] }
  ])
});

const updateChild = async () => {
  await helpers.refreshDeepItem({
    item: { custom_id: 2, name: 'Updated Child', parent_custom_id: 1 },
    findFn: (item) => item.custom_id === 2,
    childKey: 'children',
    parentKey: 'parent_custom_id'
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
