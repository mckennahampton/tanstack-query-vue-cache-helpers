<script setup lang="ts">
import { ref } from 'vue'
import { mutationFactory, queryFactory, useTanstackCacheHelpers } from '../../../composables/useTanstackQueryHelpers'

interface Item { id?: number, name: string }
const queryKey = 'CancelWithConfirmation';
const helpers = useTanstackCacheHelpers<Item>([queryKey]);
const called = ref(false)
const asked = ref(false)

const query = queryFactory({
  queryKey,
  queryFn: () => Promise.resolve([{ id: 1, name: 'First' }]),
});


const mutation = mutationFactory({
  mutationFn: () => {
    called.value = true
    return Promise.resolve({ id: 2, name: 'Should Not Call' })
  },
  onSuccessFn: () => {},
  confirm: () => Promise.resolve(false)
})

const mutate = async () => {
  await mutation.mutateAsync({ name: 'Skip' })
  asked.value = true
}

defineExpose({ mutate, called, helpers })
</script>
<template>
  <div id="asked">{{ asked }}</div>
  <div id="called">{{ called }}</div>
  <div>{{ query.data }}</div>
</template>