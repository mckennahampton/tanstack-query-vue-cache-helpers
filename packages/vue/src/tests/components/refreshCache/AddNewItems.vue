<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item { id: number, name: string }
const queryKey = ['AddNewItems'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const addNewItem = async () => {
  const newItem = { id: 3, name: "New Item" };
  await helpers.refreshCache({ items: [newItem] });
};

defineExpose({ addNewItem, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 