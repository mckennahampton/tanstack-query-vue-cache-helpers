<script setup lang="ts">
import { queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

interface Item {
  id: number
  name: string
  parentId?: number
  children?: Item[]
}

const queryKey = 'InsertNestedItem';
const helpers = useTanstackCacheHelpers<Item>([queryKey]);

const query = queryFactory<Item>({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: 'Parent', children: [] }
  ])
});

const insertChild = async () => {
  await helpers.refreshDeepItemInTanstackCache({
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
