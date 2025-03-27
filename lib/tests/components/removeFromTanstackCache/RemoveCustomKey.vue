<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = "RemoveCustomKey";
const helpers = useTanstackCacheHelpers<{ uuid: string, name: string}>([queryKey]);

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([
    { uuid: "abc", name: "Remove Me" },
    { uuid: "def", name: "Keep Item" },
  ])
});

const removeCustom = async () => {
  await helpers.removeFromTanstackCache({ target: "abc", identityKey: "uuid" });
};

defineExpose({ removeCustom, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>