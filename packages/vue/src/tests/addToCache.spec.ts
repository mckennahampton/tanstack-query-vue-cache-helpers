import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import AddToUninitializedCache from './components/addToCache/AddToUninitializedCache.vue';

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe("addToCache", () => {
  it("should handle adding to an uninitialized cache", async () => {
    const wrapper = mount(AddToUninitializedCache, { global: { plugins: [VueQueryPlugin] } });

    // Verify the query is not initialized
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
    
    // Attempt to add an item
    await wrapper.vm.addItem();
    
    // Verify the query is still not initialized
    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(false);
  });
}); 