<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ['RemoveMultipleItems'];
const helpers = useTanstackCacheHelpers(queryKey);

const query = useQuery({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: "Remove A" },
    { id: 2, name: "Remove B" },
    { id: 3, name: "Keep C" },
  ]),
});

const remove1 = async () => {
  await helpers.removeItem({ target: 1 });
};

const remove2 = async () => {
  await helpers.removeItem({ target: 2 });
};

defineExpose({ remove1, remove2, query, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>