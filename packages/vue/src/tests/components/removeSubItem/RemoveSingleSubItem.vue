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
  subItem: SubItem | null
}

const queryKey = ['RemoveSingleSubItem'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: "Parent Item", subItem: { id: 101, name: "Single Sub Item" } }]),
});

const removeItem = async () => {

  await helpers.removeSubItem({
    targetKeyValue: 1,
    subItemsKey: "subItem",
    removalKey: "id",
    removalKeyValue: 101,
  });
};

defineExpose({ removeItem, query, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data?.value)">
    {{ query.data?.value }}
  </div>
</template> 