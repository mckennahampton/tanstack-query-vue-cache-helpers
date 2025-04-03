<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface SubItem {
  id: number;
  name: string;
}

interface Item {
  id: number;
  sub: Record<number, SubItem>;
}

const queryKey = ['ReplaceArrayAsObject'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () =>
    Promise.resolve([
      { id: 1, sub: { 1: { id: 1, name: 'Old Sub 1' }, 2: { id: 2, name: 'Old Sub 2' } } },
    ]),
});

const update = async () => {
  await helpers.refreshPartialItem({
    targetKeyValue: 1,
    updateKey: 'sub',
    updatedContent: { 2: { id: 2, name: 'Updated Sub 2' }, 3: { id: 3, name: 'New Sub 3' } },
    treatArrayAsObject: true,
  });
};

defineExpose({ query, update, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    <div>{{ query.data }}</div>
  </div>
</template>
