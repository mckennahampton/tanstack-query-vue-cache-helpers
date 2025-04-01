<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  id: number;
  detail: { info: string };
}

const queryKey = ['ReplaceSingleObject'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () =>
    Promise.resolve([
      { id: 1, detail: { info: 'Old Info' } },
    ]),
});

const update = async () => {
  await helpers.refreshPartialItem({
    targetKeyValue: 1,
    updateKey: 'detail',
    updatedContent: { info: 'Updated Info' },
  });
};

defineExpose({ query, update, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    <div>{{ query.data }}</div>
  </div>
</template>
