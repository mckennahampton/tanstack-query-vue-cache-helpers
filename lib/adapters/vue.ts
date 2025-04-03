import { nextTick } from "vue"

export const vueAdapter = {
    nextTick: () => nextTick()
} 