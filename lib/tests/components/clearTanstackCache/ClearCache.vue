<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ['AddToFront'];
const helpers = useTanstackCacheHelpers(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'Added First' }, { id: 2, name: 'Original Item' }]),
});

defineExpose({ query, helpers });
</script>
<template>
    <div v-if="query.data.value && query.data.value.length > 0">{{ query.data }}</div>
    <div v-else>No Items</div>
</template>