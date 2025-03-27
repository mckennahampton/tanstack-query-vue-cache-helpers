<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ['AddToBack'];
const helpers = useTanstackCacheHelpers(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'First' }]),
});

const addItemToBack = async () => {
  await helpers.addToCache({ item: { id: 2, name: 'Last' }, placement: 'back' });
};

defineExpose({ query, addItemToBack, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>