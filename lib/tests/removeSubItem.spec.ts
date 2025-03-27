import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { VueQueryPlugin } from '@tanstack/vue-query'
import RemoveSingleSubItem from './components/removeSubItem/RemoveSingleSubItem.vue'

const pollArgs = { interval: 250, timeout: 5000 }

describe('removeSubItem', () => {
  it('should nullify a single sub-item when removing', async () => {
    const wrapper = mount(RemoveSingleSubItem, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Single Sub Item');
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('null');
  });
}); 