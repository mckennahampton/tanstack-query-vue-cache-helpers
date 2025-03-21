<script setup lang="ts">
import { mutationFactory, queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

interface Item { id?: number, name: string }
const queryKey = 'SuccessWithoutConfirmation';
const helpers = useTanstackCacheHelpers<Item>([queryKey]);

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'First' }]),
});

const mutation = mutationFactory({
  mutationFn: (data: Item) => Promise.resolve({ id: 5, ...data }),
  onSuccessFn: (data: Item) => helpers.refreshTanstackCache({ items: [data] })
})

const mutate = async () => {
  await mutation.mutateAsync({ name: 'No Confirm' })
}

defineExpose({ mutate, helpers })
</script>
<template>
  <div>{{ query.data }}</div>
</template>