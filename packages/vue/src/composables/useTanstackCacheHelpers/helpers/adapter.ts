import { nextTick } from "vue"
import type { IFrameworkAdapter } from "@tanstack-query-cache-helpers/core"

export const vueAdapter: IFrameworkAdapter = {
    nextTick: () => nextTick()
} 