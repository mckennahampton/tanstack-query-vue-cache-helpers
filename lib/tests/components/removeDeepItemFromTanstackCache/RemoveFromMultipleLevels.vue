<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  id: number
  name: string
  children?: Item[]
}

const queryKey = ['RemoveFromMultipleLevels'];
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
      children: [
        {
          id: 2,
          name: "Child 1",
          children: [{ id: 4, name: "Grandchild 1" }],
        },
      ],
    },
  ];

  await helpers.refreshCache({ items: initialData });
  await helpers.removeDeepItem({
    targetKeyValue: 4,
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