<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ['RemoveOneItem'];
const helpers = useTanstackCacheHelpers(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => new Promise<{ id: number, name: string }[]>((resolve) => {
    resolve([
      { id: 1, name: "Item to Remove" },
      { id: 2, name: "Item to Keep" },
    ]);
  }),
});

const removeItem = async () => {
  await helpers.removeItem({ target: 1 });
};

defineExpose({
  removeItem,
  query,
  helpers
});
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    {{ query.data }}
  </div>
</template>