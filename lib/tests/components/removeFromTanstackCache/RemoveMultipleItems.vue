<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = "RemoveMultipleItems";
const helpers = useTanstackCacheHelpers(queryKey);

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([
    { id: 1, name: "Remove A" },
    { id: 2, name: "Remove B" },
    { id: 3, name: "Keep C" },
  ]),
});

const remove1 = async () => {
  await helpers.removeFromTanstackCache({ target: 1 })
}

const remove2 = async () => {
  await helpers.removeFromTanstackCache({ target: 2 })
}

defineExpose({ remove1, remove2, query, helpers })
</script>
<template>
  <div>{{ query.data }}</div>
</template>