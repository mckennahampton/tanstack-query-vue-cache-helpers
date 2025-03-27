import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import AddToUninitializedCache from './components/addToCache/AddToUninitializedCache.vue';
import RemoveFromUninitializedCache from './components/removeItem/RemoveFromUninitializedCache.vue';
import UpdateInUninitializedCache from './components/updateItem/UpdateInUninitializedCache.vue';
import RefreshUninitializedCache from './components/refreshCache/RefreshUninitializedCache.vue';
import RefreshDeepInUninitializedCache from './components/refreshDeepItem/RefreshDeepInUninitializedCache.vue';
import RefreshPartialInUninitializedCache from './components/refreshPartialItem/RefreshPartialInUninitializedCache.vue';
import RemoveSubItemFromUninitializedCache from './components/removeSubItem/RemoveSubItemFromUninitializedCache.vue';
import RemoveDeepItemFromUninitializedCache from './components/removeDeepItem/RemoveDeepItemFromUninitializedCache.vue';
import ClearUninitializedCache from './components/clearCache/ClearUninitializedCache.vue';

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe("uninitialized cache handling", () => {
  it("should handle adding to an uninitialized cache", async () => {
    const wrapper = mount(AddToUninitializedCache, { global: { plugins: [VueQueryPlugin] } });

    // Verify the query is not initialized
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    
    // Attempt to add an item
    await wrapper.vm.addItem();
    
    // Verify the query is still not initialized
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });

  it("should handle removing from an uninitialized cache", async () => {
    const wrapper = mount(RemoveFromUninitializedCache, { global: { plugins: [VueQueryPlugin] } });

    // Verify the query is not initialized
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    
    // Attempt to remove an item
    await wrapper.vm.removeItem();
    
    // Verify the query is still not initialized
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });

  it("should handle updating in an uninitialized cache", async () => {
    const wrapper = mount(UpdateInUninitializedCache, { global: { plugins: [VueQueryPlugin] } });

    // Verify the query is not initialized
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    
    // Attempt to update an item
    await wrapper.vm.updateItem();
    
    // Verify the query is still not initialized
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });

  it("should handle refreshing an uninitialized cache", async () => {
    const wrapper = mount(RefreshUninitializedCache, { global: { plugins: [VueQueryPlugin] } });
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    await wrapper.vm.refreshCache();
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });

  it("should handle refreshing a deep item in an uninitialized cache", async () => {
    const wrapper = mount(RefreshDeepInUninitializedCache, { global: { plugins: [VueQueryPlugin] } });
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    await wrapper.vm.refreshDeepItem();
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });

  it("should handle refreshing a partial item in an uninitialized cache", async () => {
    const wrapper = mount(RefreshPartialInUninitializedCache, { global: { plugins: [VueQueryPlugin] } });
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    await wrapper.vm.refreshPartialItem();
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });

  it("should handle removing a sub-item from an uninitialized cache", async () => {
    const wrapper = mount(RemoveSubItemFromUninitializedCache, { global: { plugins: [VueQueryPlugin] } });
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    await wrapper.vm.removeSubItem();
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });

  it("should handle removing a deep item from an uninitialized cache", async () => {
    const wrapper = mount(RemoveDeepItemFromUninitializedCache, { global: { plugins: [VueQueryPlugin] } });
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    await wrapper.vm.removeDeepItem();
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });

  it("should handle clearing an uninitialized cache", async () => {
    const wrapper = mount(ClearUninitializedCache, { global: { plugins: [VueQueryPlugin] } });
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    await wrapper.vm.clearCache();
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });
}); 