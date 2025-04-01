<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'
import { useQuery } from '@tanstack/vue-query'

interface Item {
  customId: number;
  name: string;
}

const queryKey = ['UpdateItemWithCustomId'];
const helpers = useTanstackCacheHelpers<Item>(queryKey);

const query = useQuery<Item[], Error, Item[]>({
  queryKey,
  queryFn: () => Promise.resolve([{ customId: 1, name: 'Original Item' }]),
});

const updateItem = async () => {
  await helpers.updateItem({ 
    item: { customId: 1, name: 'Updated Item' },
    identityKey: 'customId'
  });
};

defineExpose({ query, updateItem, helpers });
</script>
<template>
  <div>{{ query.data }}</div>
</template> 