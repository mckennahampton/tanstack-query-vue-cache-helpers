import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import UpdateExistingItems from './components/refreshCache/UpdateExistingItems.vue';
import AddNewItems from './components/refreshCache/AddNewItems.vue';
import AddToFront from './components/refreshCache/AddToFront.vue';
import AddToBack from './components/refreshCache/AddToBack.vue';
import EmptyArray from './components/refreshCache/EmptyArray.vue';

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe("refreshTanstackCache", () => {
  it("should update existing items in the cache", async () => {
    const wrapper = mount(UpdateExistingItems, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.updateItems();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Updated Item 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 2');
  });

  it("should add new items to the cache", async () => {
    const wrapper = mount(AddNewItems, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.addNewItem();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Item');
  });

  it("should add new items to the front when newItemsLocation is 'front'", async () => {
    const wrapper = mount(AddToFront, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.addToFront();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Item');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 1');
  });

  it("should add new items to the back when newItemsLocation is 'back'", async () => {
    const wrapper = mount(AddToBack, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.addToBack();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 1');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('New Item');
  });

  it("should not modify cache if called with an empty array", async () => {
    const wrapper = mount(EmptyArray, { global: { plugins: [VueQueryPlugin] } });

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.testEmptyArray();
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Item 1');
  });
});