import type { IFrameworkAdapter } from "@tanstack-query-cache-helpers/core"

export const reactAdapter: IFrameworkAdapter = {
    nextTick: async () => {
        return new Promise<void>((resolve) => {
            // Use requestAnimationFrame for browser environments or immediate resolution for test environments
            if (typeof window !== 'undefined' && typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(() => {
                    resolve()
                })
            } else {
                // For testing environments, resolve immediately
                resolve()
            }
        })
    }
} 