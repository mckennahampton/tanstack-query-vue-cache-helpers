import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { VueQueryPlugin } from '@tanstack/vue-query'

import UpdateNestedItem from './components/refreshDeepItemInTanstackCache/UpdateNestedItem.vue'
import InsertNestedItem from './components/refreshDeepItemInTanstackCache/InsertNestedItem.vue'
import AddRootLevelItem from './components/refreshDeepItemInTanstackCache/AddRootLevelItem.vue'

const pollArgs = { interval: 100, timeout: 5000 }

describe('refreshDeepItemInTanstackCache', () => {
  it('updates an existing nested item', async () => {
    const wrapper = mount(UpdateNestedItem, { global: { plugins: [VueQueryPlugin] } })
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Child')

    await wrapper.vm.updateChild()
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Child')
  })

  it('inserts a new nested item if not found', async () => {
    const wrapper = mount(InsertNestedItem, { global: { plugins: [VueQueryPlugin] } })
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('New Child')

    await wrapper.vm.insertChild()
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Child')
  })

  it('adds a root-level item if no parentId', async () => {
    const wrapper = mount(AddRootLevelItem, { global: { plugins: [VueQueryPlugin] } })
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('New Root')

    await wrapper.vm.addRoot()
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Root')
  })
})
