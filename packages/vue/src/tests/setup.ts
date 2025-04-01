import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { config } from '@vue/test-utils'
import { expect, afterEach } from 'vitest'

// Create a new QueryClient for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
  },
})

// Configure Vue Query for testing
config.global.plugins = [[VueQueryPlugin, { queryClient }]]

// Clean up after each test
afterEach(() => {
  queryClient.clear()
})

// Extend expect with polling functionality
expect.extend({
  async poll(fn: () => any, options: { interval: number; timeout: number }) {
    const startTime = Date.now()
    let lastError: Error | null = null

    while (Date.now() - startTime < options.timeout) {
      try {
        const result = await fn()
        return {
          message: () => 'expected polling to fail',
          pass: true,
        }
      } catch (error) {
        lastError = error as Error
        await new Promise(resolve => setTimeout(resolve, options.interval))
      }
    }

    return {
      message: () => `expected polling to succeed, but it failed with: ${lastError?.message}`,
      pass: false,
    }
  },
})

// Add any other global test setup here 