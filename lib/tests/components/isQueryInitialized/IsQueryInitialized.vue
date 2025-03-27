<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ['isQueryInitializedTest'];
const { isQueryInitialized } = useTanstackCacheHelpers<{id: number, name: string}>(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: "Init Item" }]),
});

defineExpose({
  isQueryInitialized,
  query,
});
</script>

<template>
    <div data-testid="status">{{ isQueryInitialized() }}</div>
    <div>{{ query.data }}</div>
</template>