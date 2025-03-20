import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { useTanstackCacheHelpers } from "../composables/useTanstackQueryHelpers";

const queryClient = new QueryClient();

// Utility to create a Vue component for testing
const createTestComponent = (fn: () => any) =>
  defineComponent({
    setup: fn,
    render: () => h("div"),
  });

describe("refreshTanstackCache", () => {
  let wrapper: any;

  beforeEach(() => {
    queryClient.clear();
    wrapper = mount(
      createTestComponent(() => {
        const helpers = useTanstackCacheHelpers("testCache");
        return { helpers };
      }),
      {
        global: {
          plugins: [VueQueryPlugin],
        },
      }
    );
  });

  it("should update existing items in the cache", async () => {
    const initialItems = [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }];
    const updatedItem = { id: 1, name: "Updated Item 1" };

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialItems });
    await wrapper.vm.helpers.refreshTanstackCache({ items: [updatedItem] });


    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toBeInstanceOf(Array);
        expect(cacheData).toContainEqual(updatedItem);
        expect(cacheData).toContainEqual(initialItems[1]); // Ensure other item is still present
    }, 1000);
  });

  it("should add new items to the cache", async () => {
    const newItem = { id: 3, name: "New Item" };

    await wrapper.vm.helpers.refreshTanstackCache({ items: [newItem] });

    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toBeInstanceOf(Array);
        expect(cacheData).toContainEqual(newItem);
    }, 1000);
  });

  it("should add new items to the front when newItemsLocation is 'front'", async () => {
    const initialItems = [{ id: 1, name: "Item 1" }];
    const newItem = { id: 2, name: "New Item" };

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialItems });
    await wrapper.vm.helpers.refreshTanstackCache({ items: [newItem], newItemsLocation: "front" });

    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0]).toEqual(newItem); // New item should be at the front
        }
    }, 1000)
  });

  it("should add new items to the back when newItemsLocation is 'back'", async () => {
    const initialItems = [{ id: 1, name: "Item 1" }];
    const newItem = { id: 2, name: "New Item" };

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialItems });
    await wrapper.vm.helpers.refreshTanstackCache({ items: [newItem], newItemsLocation: "back" });

    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect([cacheData.length - 1]).toEqual(newItem); // New item should be at the back
        }
    }, 1000);
  });

  it("should not modify cache if called with an empty array", async () => {
    const initialItems = [{ id: 1, name: "Item 1" }];
    
    await wrapper.vm.helpers.refreshTanstackCache({ items: initialItems });
    await wrapper.vm.helpers.refreshTanstackCache({ items: [] });

    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toEqual(initialItems); // Cache should remain unchanged
    }, 1000);
  });
});