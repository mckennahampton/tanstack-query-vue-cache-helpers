<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface SubItem {
  id: number;
  name: string;
}

interface Item {
  id: number;
  sub: SubItem;
}

const queryKey = ['RemoveSingleSubItem'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () =>
    Promise.resolve([
      { id: 1, sub: { id: 1, name: 'Single Sub Item' } },
    ]),
});

const removeItem = async () => {
  await helpers.removeSubItem({
    targetKeyValue: 1,
    subItemsKey: 'sub',
    removalKey: 'id',
    removalKeyValue: 1
  });
};

defineExpose({ query, removeItem, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    <div>{{ query.data }}</div>
  </div>
</template> 