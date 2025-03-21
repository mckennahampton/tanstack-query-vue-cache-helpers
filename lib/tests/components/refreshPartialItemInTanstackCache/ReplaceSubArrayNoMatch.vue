<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

interface SubItem {
  id: number;
  name: string;
}
interface Item {
  id: number;
  sub: SubItem[];
}
const queryKey = 'ReplaceSubArrayNoMatch';
const helpers = useTanstackCacheHelpers<Item>([queryKey]);

const query = queryFactory<Item>({
  queryKey,
  queryFn: () =>
    Promise.resolve([
      { id: 1, sub: [{ id: 1, name: 'Old Sub 1' }, { id: 2, name: 'Old Sub 2' }] },
    ]),
});

const update = async () => {
  await helpers.refreshPartialItemInTanstackCache({
    targetKeyValue: 1,
    replacementKey: 'sub',
    replacementContent: [{ id: 3, name: 'New Sub 3' }, { id: 4, name: 'New Sub 4' }],
  });
};

defineExpose({ query, update, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    <div>{{ query.data }}</div>
  </div>
</template>
