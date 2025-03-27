<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = "RemoveMissingItem";
const helpers = useTanstackCacheHelpers([queryKey]);

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: "Still Here" },
  ])
});

const removeMissing = async () => {
  await helpers.removeFromTanstackCache({ target: 999 });
};

defineExpose({ removeMissing, helpers });
</script>
<template>
    <div>{{ query.data }}</div>
</template>
