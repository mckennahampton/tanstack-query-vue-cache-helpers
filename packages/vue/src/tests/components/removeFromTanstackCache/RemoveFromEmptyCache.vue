<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item { id: number, name: string }

const queryKey = ["RemoveFromEmptyCache"];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const removeFromEmpty = async () => {
  await helpers.removeItem({ target: 1 });
};

defineExpose({ removeFromEmpty, helpers });
</script>
<template>
    <div v-if="query.data.value && query.data.value.length > 0">{{ query.data }}</div>
    <div v-else>No Items</div>
</template>
