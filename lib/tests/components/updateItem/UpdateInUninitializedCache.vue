<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  id: number
  name: string
}

const queryKey = ['UpdateInUninitializedCache'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

// Don't initialize the query, just create it
const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
  enabled: false // This prevents the query from being initialized
});

const updateItem = async () => {
  await helpers.updateItem({ item: { id: 1, name: "Updated Item" } });
};

defineExpose({ updateItem, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 