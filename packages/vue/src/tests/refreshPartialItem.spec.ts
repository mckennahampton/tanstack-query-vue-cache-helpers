import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { VueQueryPlugin } from '@tanstack/vue-query'
import ReplaceSubArray from './components/refreshPartialItem/ReplaceSubArray.vue'
import ReplaceSubArrayNoMatch from './components/refreshPartialItem/ReplaceSubArrayNoMatch.vue'
import ReplaceSingleObject from './components/refreshPartialItem/ReplaceSingleObject.vue'
import ReplaceArrayAsObject from './components/refreshPartialItem/ReplaceArrayAsObject.vue'
import UpdateWithCustomFindFn from './components/refreshPartialItem/UpdateWithCustomFindFn.vue'

const pollArgs = { interval: 250, timeout: 5000 }

describe('refreshPartialItemInTanstackCache', () => {

  it('replaces the entire sub-array when no identities match', async () => {
    const wrapper = mount(ReplaceSubArrayNoMatch, {
      global: { plugins: [VueQueryPlugin] },
    });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Old Sub 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Old Sub 2');
    await wrapper.vm.update();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Old Sub 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Old Sub 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Sub 3');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Sub 4');
  });

  it('replaces a single object property within the target item', async () => {
    const wrapper = mount(ReplaceSingleObject, {
      global: { plugins: [VueQueryPlugin] },
    });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Old Info');
    await wrapper.vm.update();
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Old Info');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Info');
  });

  it('replaces the entire object-like subfield when treatArrayAsObject is true', async () => {
    const wrapper = mount(ReplaceArrayAsObject, {
      global: { plugins: [VueQueryPlugin] },
    });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);

    // Wait for initial data
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Old Sub 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Old Sub 2');

    // Trigger update
    await wrapper.vm.update();

    // Assert old values removed and new ones added
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Old Sub 1');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Old Sub 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Sub 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Sub 3');
  });

  it('should replace sub-array with array content', async () => {
    const wrapper = mount(ReplaceSubArray, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.updateWithArray();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Sub 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Sub 3');
  });

  it('should replace sub-array with single item', async () => {
    const wrapper = mount(ReplaceSubArray, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.updateWithSingleItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Single New Sub');
  });
  it('should add new sub item to array with custom findFn', async () => {
    const wrapper = mount(UpdateWithCustomFindFn, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    
    // Verify initial state
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 2');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('New Tag');
    
    // Add a new tag using custom findFn
    await wrapper.vm.addNewTag();
    
    // Verify new tag was added while preserving existing ones
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Tag');
    
  });
  it('should update sub item with both findFn and subItemFindFn', async () => {
    const wrapper = mount(UpdateWithCustomFindFn, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    
    // Verify initial state
    console.log(wrapper.text())
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 2');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Updated Tag 2');
    
    // Update tag using both findFn and subItemFindFn
    await wrapper.vm.updateTag();
    console.log(wrapper.text())
    
    // Verify specific tag was updated
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Tag 2');
    
  });
  it('should update item field using findFn to locate the parent item', async () => {
    const wrapper = mount(UpdateWithCustomFindFn, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    
    // Verify initial state
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Test Item');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Updated Item Name');
    
    // Update name using findFn
    await wrapper.vm.updateItemName();
    
    // Verify name was updated but tags remain
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Test Item');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Item Name');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Tag 2');
    
  });

});