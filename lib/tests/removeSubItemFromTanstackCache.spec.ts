import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import RemoveFromArray from './components/removeSubItemFromTanstackCache/RemoveFromArray.vue';
import RemoveNonExistentSubItem from './components/removeSubItemFromTanstackCache/RemoveNonExistentSubItem.vue';
import RemoveSingleSubItem from './components/removeSubItemFromTanstackCache/RemoveSingleSubItem.vue';
import RemoveFromNonExistentParent from './components/removeSubItemFromTanstackCache/RemoveFromNonExistentParent.vue';

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe("removeSubItemFromTanstackCache", () => {
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

  it("should nullify a single sub-item instead of an array", async () => {
    const wrapper = mount(RemoveSingleSubItem, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('null');
  });

  it("should do nothing if the parent item is not found", async () => {
    const wrapper = mount(RemoveFromNonExistentParent, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.removeItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Sub Item 1');
  });
});