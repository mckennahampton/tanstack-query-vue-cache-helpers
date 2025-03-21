<script setup lang="ts">
import { ref } from 'vue'
import { queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

interface Item { id: number, name: string }
const queryKey = 'QueryRefetch';
const helpers = useTanstackCacheHelpers([queryKey]);

const callCount = ref(0);

const query = queryFactory<Item>({
  queryKey,
  queryFn: () => {
    callCount.value++;
    return Promise.resolve([{ id: callCount.value, name: 'Fetched' + callCount.value }])
  },
});

const refetch = async () => {
  await query.refetch();
};

defineExpose({ query, refetch, callCount, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>
