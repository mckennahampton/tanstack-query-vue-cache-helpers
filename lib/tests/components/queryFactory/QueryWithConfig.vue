<script setup lang="ts">
import { queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

interface Item { id: number, name: string }
const queryKey = 'QueryWithConfig';
const helpers = useTanstackCacheHelpers([queryKey]);

const query = queryFactory<Item>({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'Configurable' }]),
  aditionalConfig: {
    staleTime: 99999,
    refetchOnMount: false,
  }
});

defineExpose({ query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>
