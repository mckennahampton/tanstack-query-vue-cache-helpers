<script setup lang="ts">
import { ref } from 'vue'
import { mutationFactory, queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

interface Item { id?: number, name: string }
const queryKey = 'SuccessWithConfirmation';
const helpers = useTanstackCacheHelpers<Item>([queryKey]);
const item = ref<{ id?: number, name: string }>({ name: 'Confirmed Item' })

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'First' }]),
});

const mutation = mutationFactory({
  mutationFn: (data: Item) => Promise.resolve({ id: 1, ...data }),
  onSuccessFn: (data: Item) => helpers.refreshTanstackCache({ items: [data] }),
  confirm: () => Promise.resolve(true)
})

const mutate = async () => {
  await mutation.mutateAsync(item.value)
}

defineExpose({ mutate, helpers })
</script>
<template>
  <div>{{ query.data }}</div>
</template>
