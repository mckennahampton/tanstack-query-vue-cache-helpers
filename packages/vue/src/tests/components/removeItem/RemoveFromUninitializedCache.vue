<script setup lang="ts">
import { useTanstackCacheHelpers } from '../../../composables/useTanstackCacheHelpers'

const queryKey = "RemoveFromUninitializedCache";
const helpers = useTanstackCacheHelpers([queryKey]);

const removeItem = async () => {
    helpers.removeItem({ target: 1 });
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