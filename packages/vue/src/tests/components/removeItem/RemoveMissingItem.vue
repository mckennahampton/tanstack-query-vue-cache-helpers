<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ['RemoveMissingItem'];
const helpers = useTanstackCacheHelpers(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: "Still Here" },
  ])
});

const removeMissing = async () => {
  await helpers.removeItem({ target: 999 });
};

defineExpose({ removeMissing, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>
