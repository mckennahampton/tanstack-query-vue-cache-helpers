<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ['AddToEmpty'];
const helpers = useTanstackCacheHelpers(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const addItem = async () => {
  await helpers.addToCache({ item: { id: 1, name: 'First Item' } });
}

defineExpose({ query, addItem, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>