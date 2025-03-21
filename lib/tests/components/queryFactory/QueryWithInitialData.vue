<script setup lang="ts">
import { queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'
import { usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'

interface Item { id: number, name: string }
const queryKey = 'QueryWithInitialData';
const helpers = useTanstackCacheHelpers([queryKey]);

// const mockInitialData = [{ id: 1, name: 'Initial Data' }];
// const page = usePage();
// page.props[queryKey] = computed(() => mockInitialData);
const counter = ref(0);
const query = queryFactory<Item>({
  queryKey,
  queryFn: () => {
    counter.value += 1;
    return Promise.resolve([{ id: 2, name: 'From QueryFn' }])
  },
  useInitialData: true,
  aditionalConfig: {
    staleTime: Infinity, // prevent background refetch
  }
});

defineExpose({ query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
  <div id="counter">{{ counter }}</div>
</template>
