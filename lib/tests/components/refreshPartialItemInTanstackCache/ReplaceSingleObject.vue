<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

interface Item {
  id: number;
  detail: { info: string };
}
const queryKey = 'ReplaceSingleObject';
const helpers = useTanstackCacheHelpers<Item>([queryKey]);

const query = queryFactory<Item>({
  queryKey,
  queryFn: () =>
    Promise.resolve([
      { id: 1, detail: { info: 'Old Info' } },
    ]),
});

const update = async () => {
  await helpers.refreshPartialItemInTanstackCache({
    targetKeyValue: 1,
    replacementKey: 'detail',
    replacementContent: { info: 'Updated Info' },
  });
};

defineExpose({ query, update, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    <div>{{ query.data }}</div>
  </div>
</template>
