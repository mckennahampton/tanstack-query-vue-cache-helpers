import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { VueQueryPlugin } from '@tanstack/vue-query'
import QueryFnOnly from './components/queryFactory/QueryFnOnly.vue'
import QueryWithInitialData from './components/queryFactory/QueryWithInitialData.vue'
import QueryWithConfig from './components/queryFactory/QueryWithConfig.vue'
import QueryRefetch from './components/queryFactory/QueryRefetch.vue'

const pollArgs = { interval: 250, timeout: 10000 }
// Mock usePage to return test data
vi.mock("@inertiajs/vue3", () => ({
    usePage: vi.fn(() => ({
        props: {
            QueryWithInitialData: [{ id: 1, name: "Initial Item" }]
        }
    }))
}));

describe('queryFactory', () => {
  it('initializes with queryFn data', async () => {
    const wrapper = mount(QueryFnOnly, { global: { plugins: [VueQueryPlugin] } })
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('From QueryFn')
  })

  it('uses initialData from page props', async () => {
    const wrapper = mount(QueryWithInitialData, { global: { plugins: [VueQueryPlugin] } })
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Initial Item')
  })

  it('applies aditionalConfig properly', async () => {
    const wrapper = mount(QueryWithConfig, { global: { plugins: [VueQueryPlugin] } })
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Configurable')
  })

  it('refetches and updates query data', async () => {
    const wrapper = mount(QueryRefetch, { global: { plugins: [VueQueryPlugin] } })
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Fetched1')

    await wrapper.vm.refetch()
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Fetched2')
  })
})
