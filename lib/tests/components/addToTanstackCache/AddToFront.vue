<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ['AddToFront'];
const helpers = useTanstackCacheHelpers(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 2, name: 'Original Item' }]),
});

const addItemToFront = async () => {
  await helpers.addToCache({ item: { id: 1, name: 'Added First' }, placement: 'start' });
};

defineExpose({ query, addItemToFront, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>