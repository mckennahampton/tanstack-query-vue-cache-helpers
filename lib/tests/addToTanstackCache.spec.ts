import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { VueQueryPlugin } from '@tanstack/vue-query';
import AddToEmpty from './components/addToTanstackCache/AddToEmpty.vue';
import AddToFront from './components/addToTanstackCache/AddToFront.vue';
import AddToBack from './components/addToTanstackCache/AddToBack.vue';

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe('addToTanstackCache tests', () => {
  it('adds to an empty cache', async () => {
    const wrapper = mount(AddToEmpty, { global: { plugins: [VueQueryPlugin] } });


    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.addItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('First Item');
  });

  it('adds item to the front', async () => {
    const wrapper = mount(AddToFront, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.addItemToFront();
    await expect.poll(() => {
        const text = wrapper.text();
        const firstIndex = text.indexOf('Added First');
        const secondIndex = text.indexOf('Original Item');
        return firstIndex < secondIndex;
      }, pollArgs).toBe(true)
  });

  it('adds item to the back', async () => {
    const wrapper = mount(AddToBack, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.addItemToBack();
    await expect.poll(() => {
        const text = wrapper.text();
        return text.indexOf('First') < text.indexOf('Last');
    }, pollArgs).toBe(true);
  });
});
