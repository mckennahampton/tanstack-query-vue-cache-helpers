<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = 'AddToFront';
const helpers = useTanstackCacheHelpers([queryKey]);

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 2, name: 'Original Item' }]),
});

const addItemToFront = async () => {
  await helpers.addToTanstackCache({ item: { id: 1, name: 'Added First' }, placement: 'start' });
};

defineExpose({ query, addItemToFront, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>