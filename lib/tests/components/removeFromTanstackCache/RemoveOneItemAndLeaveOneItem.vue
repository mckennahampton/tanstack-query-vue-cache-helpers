<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = "RemoveOneItemAndLeaveOneItem";
const helpers = useTanstackCacheHelpers(queryKey);
const query = queryFactory({
    queryKey: queryKey,
    queryFn: () => new Promise<{ id: number, name: string }[]>((resolve) => {
        resolve([
            { id: 1, name: "Item to Remove" },
            { id: 2, name: "Item to Keep" },
        ]);
    }),
})


const removeItem = async () => {
    helpers.removeFromTanstackCache({ target: 1 });
}

defineExpose({
    removeItem,
    query,
    helpers
})
</script>
<template>
    <div>
        {{ query.data }}
    </div>
</template>