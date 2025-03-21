<script setup lang="ts">
import { queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

interface Item { id: number, name: string }
const queryKey = 'QueryFnOnly';
const helpers = useTanstackCacheHelpers([queryKey]);
const query = queryFactory<Item>({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'From QueryFn' }]),
});

defineExpose({ query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>
