<script setup lang="ts">
import { useTanstackCacheHelpers, queryFactory } from '../../../composables/useTanstackQueryHelpers'

const queryKey = "RemoveFromUninitializedCache";
const helpers = useTanstackCacheHelpers([queryKey]);

const removeItem = async () => {
    helpers.removeFromTanstackCache({ target: 1 });
}

defineExpose({
    removeItem,
    // query,
    helpers
})
</script>
<template>
    <!-- <div>
        {{ query.data }}
    </div> -->
</template>