<script setup lang="ts">
import { queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

const queryKey = "isQueryInitializedTest";
const { isQueryInitialized } = useTanstackCacheHelpers<{id: number, name: string}>([queryKey]);

const query = queryFactory({
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