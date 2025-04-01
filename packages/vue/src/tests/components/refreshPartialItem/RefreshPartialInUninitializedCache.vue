<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface SubItem {
  id: number
  name: string
}

interface Item {
  id: number
  name: string
  subItems: SubItem[]
}

const queryKey = ['RefreshPartialInUninitializedCache'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

// Don't initialize the query, just create it
const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
  enabled: false // This prevents the query from being initialized
});

const refreshPartialItem = async () => {
  await helpers.refreshPartialItem({
    targetKeyValue: 1,
    updateKey: "subItems",
    updatedContent: [{ id: 1, name: "New Sub Item" }]
  });
};

defineExpose({ refreshPartialItem, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 