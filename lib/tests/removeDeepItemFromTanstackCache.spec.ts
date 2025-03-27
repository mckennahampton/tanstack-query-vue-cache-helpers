import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import RemoveExistingItem from './components/removeDeepItemFromTanstackCache/RemoveExistingItem.vue';
import RemoveNonExistentItem from './components/removeDeepItemFromTanstackCache/RemoveNonExistentItem.vue';
import RemoveFromMultipleParents from './components/removeDeepItemFromTanstackCache/RemoveFromMultipleParents.vue';
import RemoveFromMultipleLevels from './components/removeDeepItemFromTanstackCache/RemoveFromMultipleLevels.vue';

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe("removeDeepItemFromTanstackCache", () => {
  it("should remove an existing deep item", async () => {
    const wrapper = mount(RemoveExistingItem, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Child 2');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Child 1');
  });

  it("should do nothing if the deep item does not exist", async () => {
    const wrapper = mount(RemoveNonExistentItem, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Child 1');
  });

  it("should not affect unrelated items", async () => {
    const wrapper = mount(RemoveFromMultipleParents, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Child 2');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Child 1');
  });

  it("should remove an item from multiple levels of nesting", async () => {
    const wrapper = mount(RemoveFromMultipleLevels, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Child 1');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Grandchild 1');
  });
});