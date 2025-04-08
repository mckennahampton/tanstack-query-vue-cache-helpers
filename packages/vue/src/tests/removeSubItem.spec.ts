import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { VueQueryPlugin } from '@tanstack/vue-query'
import RemoveFromArray from './components/removeSubItem/RemoveFromArray.vue';
import RemoveNonExistentSubItem from './components/removeSubItem/RemoveNonExistentSubItem.vue';
import RemoveSingleSubItem from './components/removeSubItem/RemoveSingleSubItem.vue';
import RemoveFromNonExistentParent from './components/removeSubItem/RemoveFromNonExistentParent.vue';

const pollArgs = { interval: 250, timeout: 5000 }

describe('removeSubItem', () => {
  it('should nullify a single sub-item when removing', async () => {
    const wrapper = mount(RemoveSingleSubItem, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Single Sub Item');
    await wrapper.vm.removeItem();
    console.log(wrapper.text());
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Single Sub Item');
  });

  it("should remove a sub-item from an array inside the parent item", async () => {
    const wrapper = mount(RemoveFromArray, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Sub Item 2');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Sub Item 1');
  });

  it("should handle cases where the sub-item does not exist", async () => {
    const wrapper = mount(RemoveNonExistentSubItem, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Sub Item 1');
  });

  it("should do nothing if the parent item is not found", async () => {
    const wrapper = mount(RemoveFromNonExistentParent, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Sub Item 1');
  });
}); 