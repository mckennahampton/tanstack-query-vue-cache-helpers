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

const queryKey = ['RemoveSubItemFromUninitializedCache'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

// Don't initialize the query, just create it
const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
  enabled: false // This prevents the query from being initialized
});

const removeSubItem = async () => {
  await helpers.removeSubItem({
    targetKeyValue: 1,
    subItemsKey: "subItems",
    removalKey: "id",
    removalKeyValue: 101
  });
};

defineExpose({ removeSubItem, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 