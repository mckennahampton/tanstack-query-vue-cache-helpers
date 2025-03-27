<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item { id: number, name: string }
const queryKey = ['UpdateExistingItems'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const updateItems = async () => {
  const initialItems = [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }];
  const updatedItem = { id: 1, name: "Updated Item 1" };

  await helpers.refreshCache({ items: initialItems });
  await helpers.refreshCache({ items: [updatedItem] });
};

defineExpose({ updateItems, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 