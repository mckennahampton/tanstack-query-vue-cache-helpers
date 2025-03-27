<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'


const queryKey = ['UpdateItem'];
const helpers = useTanstackCacheHelpers(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'Original Item' }]),
});

const updateItem = async () => {
  await helpers.updateItem({ item: { id: 1, name: 'Updated Item' } })
};

defineExpose({ query, updateItem, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 