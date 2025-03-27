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

const queryKey = ['RemoveNonExistentSubItem'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const removeItem = async () => {
  const initialData = [
    { id: 1, name: "Parent Item", subItems: [{ id: 101, name: "Sub Item 1" }] },
  ];

  await helpers.refreshCache({ items: initialData });
  await helpers.removeSubItem({
    targetKeyValue: 1,
    subItemsKey: "subItems",
    removalKey: "id",
    removalKeyValue: 999,
  });
};

defineExpose({ removeItem, query, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    {{ query.data }}
  </div>
</template> 