import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { VueQueryPlugin } from '@tanstack/vue-query'
import UpdateItemWithMultipleItems from './components/updateItem/UpdateItemWithMultipleItems.vue'

const pollArgs = { interval: 250, timeout: 5000 }

describe('updateItem', () => {
  it('should update matching item and keep non-matching items unchanged', async () => {
    const wrapper = mount(UpdateItemWithMultipleItems, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    
    // Verify initial state
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 3');
    
    // Update item with id 2
    await wrapper.vm.updateItem();
    
    // Verify item 2 was updated and others remained unchanged
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Item 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 3');
  });
}); 