<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = "RemoveFromEmptyCache";
const helpers = useTanstackCacheHelpers(queryKey);

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([]),
});

const removeFromEmpty = async () => {
  await helpers.removeFromTanstackCache({ target: 1 });
};

defineExpose({ removeFromEmpty });
</script>
<template>
    <div v-if="query.data.value && query.data.value.length > 0">{{ query.data }}</div>
    <div v-else>No Items</div>
</template>
