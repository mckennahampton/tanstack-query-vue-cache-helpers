<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface SubItem {
  id: number
  name: string
  children?: SubItem[]
}

interface Item {
  id: number
  name: string
  parentId?: number
  children?: SubItem[]
}

const queryKey = ['RefreshDeepInUninitializedCache'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

// Don't initialize the query, just create it
const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
  enabled: false // This prevents the query from being initialized
});

const refreshDeepItem = async () => {
  await helpers.refreshDeepItem({
    item: { id: 2, name: "Child Item", parentId: 1 },
    childKey: "children",
    parentKey: "parentId"
  });
};

defineExpose({ refreshDeepItem, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 