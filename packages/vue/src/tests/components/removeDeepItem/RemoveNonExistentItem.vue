<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  id: number
  name: string
  children?: Item[]
}

const queryKey = ['RemoveNonExistentItem'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const removeItem = async () => {
  const initialData = [
    {
      id: 1,
      name: "Parent",
      children: [{ id: 2, name: "Child 1" }],
    },
  ];

  await helpers.refreshCache({ items: initialData });
  await helpers.removeDeepItem({
    targetKeyValue: 99,
    childKey: "children",
    parentKey: "id",
  });
};

defineExpose({ removeItem, query, helpers });
</script>
<template>
  <div :key="JSON.stringify(query.data)">
    {{ query.data }}
  </div>
</template> 