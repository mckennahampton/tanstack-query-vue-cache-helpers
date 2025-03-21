import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { VueQueryPlugin } from '@tanstack/vue-query'
import ReplaceSubArray from './components/refreshPartialItemInTanstackCache/ReplaceSubArray.vue'
import ReplaceSubArrayNoMatch from './components/refreshPartialItemInTanstackCache/ReplaceSubArrayNoMatch.vue'
import ReplaceSingleObject from './components/refreshPartialItemInTanstackCache/ReplaceSingleObject.vue'
import ReplaceArrayAsObject from './components/refreshPartialItemInTanstackCache/ReplaceArrayAsObject.vue'

const pollArgs = { interval: 250, timeout: 5000 }

describe('refreshPartialItemInTanstackCache', () => {
  it('updates sub-array within a target item', async () => {
    const wrapper = mount(ReplaceSubArray, {
      global: { plugins: [VueQueryPlugin] },
    });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Old Sub 1');
    await wrapper.vm.update();
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Old Sub 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Sub 2');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Sub 3');
  });

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
});