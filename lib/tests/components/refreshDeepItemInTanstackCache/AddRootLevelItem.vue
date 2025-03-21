<script setup lang="ts">
import { queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

interface Item {
  id: number
  name: string
  parentId?: number
  children?: Item[]
}

const queryKey = 'AddRootLevelItem';
const helpers = useTanstackCacheHelpers<Item>([queryKey]);

const query = queryFactory<Item>({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: 'Existing Root' }
  ])
});

const addRoot = async () => {
  await helpers.refreshDeepItemInTanstackCache({
    item: { id: 2, name: 'New Root' },
    childKey: 'children',
    parentKey: 'parentId'
  });
};

defineExpose({ addRoot, query, helpers });
</script>

<template>
  <div>
    {{ query.data }}
  </div>
</template>
