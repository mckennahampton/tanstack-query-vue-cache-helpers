<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'
interface Item {
  id: number;
  name: string;
}

const queryKey = ["RemoveMultipleByArray"];

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: 'Delete A' },
    { id: 2, name: 'Delete B' },
    { id: 3, name: 'Keep C' },
  ]),
});

const helpers = useTanstackCacheHelpers<Item>(queryKey);

const removeMultiple = async () => {
  await helpers.removeItem({ target: [1, 2] }); // triggers Array.isArray
};

defineExpose({
  query,
  removeMultiple,
    helpers
});
</script>

<template>
  <div>
    {{ query.data }}
  </div>
</template>
