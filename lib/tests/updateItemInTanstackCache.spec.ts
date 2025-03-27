import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import UpdateItem from './components/updateItemInTanstackCache/UpdateItem.vue';
import UpdateItemWithCustomId from './components/updateItemInTanstackCache/UpdateItemWithCustomId.vue';

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe('updateItemInCache tests', () => {
  it('updates an existing item in the cache', async () => {
    const wrapper = mount(UpdateItem, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.updateItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Item');
  });

  it('updates an item using a custom identity key', async () => {
    const wrapper = mount(UpdateItemWithCustomId, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.updateItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Item');
  });
});