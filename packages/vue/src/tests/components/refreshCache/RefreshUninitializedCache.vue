<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  id: number
  name: string
}

const queryKey = ['RefreshUninitializedCache'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

// Don't initialize the query, just create it
const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
  enabled: false // This prevents the query from being initialized
});

const refreshCache = async () => {
  await helpers.refreshCache({ items: [{ id: 1, name: "New Item" }] });
};

defineExpose({ refreshCache, query, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">{{ query.data }}</div>
</template> 