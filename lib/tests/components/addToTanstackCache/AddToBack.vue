<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = 'AddToBack';
const helpers = useTanstackCacheHelpers([queryKey]);

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'First' }]),
});

const addItemToBack = async () => {
  await helpers.addToTanstackCache({ item: { id: 2, name: 'Last' }, placement: 'back' });
};

defineExpose({ query, addItemToBack, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>