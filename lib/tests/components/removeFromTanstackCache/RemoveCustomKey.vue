<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

const queryKey = ["RemoveCustomKey"];
const helpers = useTanstackCacheHelpers<{ uuid: string, name: string}>(queryKey);

const query = useQuery<{ uuid: string, name: string}[], Error, { uuid: string, name: string}[]>({
  queryKey,
  queryFn: () => Promise.resolve([
    { uuid: "abc", name: "Remove Me" },
    { uuid: "def", name: "Keep Item" },
  ])
});

const removeCustom = async () => {
  await helpers.removeItem({ target: "abc", identityKey: "uuid" });
};

defineExpose({ removeCustom, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template>