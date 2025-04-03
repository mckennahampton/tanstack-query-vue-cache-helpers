<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item { id: number, name: string }
const queryKey = ['EmptyArray'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const testEmptyArray = async () => {
  const initialItems = [{ id: 1, name: "Item 1" }];
  await helpers.refreshCache({ items: initialItems });
  await helpers.refreshCache({ items: [] });
};

defineExpose({ testEmptyArray, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 