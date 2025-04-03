<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item { id: number, name: string }
const queryKey = ['AddToBack'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const addToBack = async () => {
  const initialItems = [{ id: 1, name: "Item 1" }];
  const newItem = { id: 2, name: "New Item" };

  await helpers.refreshCache({ items: initialItems });
  await helpers.refreshCache({ items: [newItem], newItemsLocation: "back" });
};

defineExpose({ addToBack, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 