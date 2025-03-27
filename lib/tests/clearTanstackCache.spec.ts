import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { VueQueryPlugin } from '@tanstack/vue-query';
import ClearCache from './components/clearTanstackCache/ClearCache.vue';

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe('clearTanstackCache', () => {
  it('clears cache', async () => {
    const wrapper = mount(ClearCache, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.helpers.clearCache();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('No Items');
  });
});
