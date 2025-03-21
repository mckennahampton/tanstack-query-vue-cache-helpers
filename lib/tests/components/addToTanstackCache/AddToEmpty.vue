<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = 'AddToEmpty';
const helpers = useTanstackCacheHelpers([queryKey]);

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const addItem = async () => {
  await helpers.addToTanstackCache({ item: { id: 1, name: 'First Item' } });
}

defineExpose({ query, addItem, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>