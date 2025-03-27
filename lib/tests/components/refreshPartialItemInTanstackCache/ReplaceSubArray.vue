<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface SubItem {
  id: number;
  name: string;
}

interface Item {
  id: number;
  sub: SubItem[];
}

const queryKey = ['ReplaceSubArray'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () =>
    Promise.resolve([
      { id: 1, sub: [{ id: 1, name: 'Old Sub 1' }, { id: 2, name: 'Old Sub 2' }] },
    ]),
});

const updateWithArray = async () => {
  await helpers.refreshPartialItem({
    targetKeyValue: 1,
    updateKey: 'sub',
    updatedContent: [{ id: 2, name: 'Updated Sub 2' }, { id: 3, name: 'New Sub 3' }],
  });
};

const updateWithSingleItem = async () => {
  await helpers.refreshPartialItem({
    targetKeyValue: 1,
    updateKey: 'sub',
    updatedContent: { id: 4, name: 'Single New Sub' },
  });
};

const updateWithArrayAsObject = async () => {
  await helpers.refreshPartialItem({
    targetKeyValue: 1,
    updateKey: 'sub',
    updatedContent: [{ id: 5, name: 'Array As Object' }],
    treatArrayAsObject: true
  });
};

defineExpose({ query, updateWithArray, updateWithSingleItem, updateWithArrayAsObject, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    <div>{{ query.data }}</div>
  </div>
</template>
