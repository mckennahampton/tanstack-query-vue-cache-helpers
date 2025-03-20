import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, it, expect, beforeEach } from "vitest";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { useTanstackCacheHelpers } from "../composables/useTanstackQueryHelpers";

const queryClient = new QueryClient();

// Utility to create a Vue component for testing
const createTestComponent = (fn: () => any) =>
  defineComponent({
    setup: fn,
    render: () => h("div"),
  });

describe("removeSubItemFromTanstackCache", () => {
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

  it("should remove a sub-item from an array inside the parent item", async () => {
    const initialData = [
      { id: 1, name: "Parent Item", subItems: [{ id: 101, name: "Sub Item 1" }, { id: 102, name: "Sub Item 2" }] },
    ];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.removeSubItemFromTanstackCache({
      targetKeyValue: 1,
      subItemsKey: "subItems",
      removalKey: "id",
      removalKeyValue: 101, // Remove sub-item with id 101
    });

    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].subItems).toEqual([{ id: 102, name: "Sub Item 2" }]);
        }
    }, 1000);
  });

  it("should handle cases where the sub-item does not exist", async () => {
    const initialData = [
      { id: 1, name: "Parent Item", subItems: [{ id: 101, name: "Sub Item 1" }] },
    ];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.removeSubItemFromTanstackCache({
      targetKeyValue: 1,
      subItemsKey: "subItems",
      removalKey: "id",
      removalKeyValue: 999, // Non-existent sub-item
    });

    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].subItems).toEqual([{ id: 101, name: "Sub Item 1" }]); // Should remain unchanged
        }
    }, 1000);
  });

  it("should nullify a single sub-item instead of an array", async () => {
    const initialData = [{ id: 1, name: "Parent Item", subItem: { id: 101, name: "Single Sub Item" } }];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.removeSubItemFromTanstackCache({
      targetKeyValue: 1,
      subItemsKey: "subItem", // This is a single object, not an array
      removalKey: "id",
      removalKeyValue: 101,
    });

    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].subItem).toBeNull(); // Should nullify the object
        }
    }, 1000);
  });

  it("should do nothing if the parent item is not found", async () => {
    const initialData = [
      { id: 1, name: "Parent Item", subItems: [{ id: 101, name: "Sub Item 1" }] },
    ];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.removeSubItemFromTanstackCache({
      targetKeyValue: 999, // Non-existent parent item
      subItemsKey: "subItems",
      removalKey: "id",
      removalKeyValue: 101,
    });

    setTimeout(() => {
        const cacheData = queryClient.getQueryData(["testCache"]);
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData).toEqual(initialData); // Should remain unchanged
        }
    }, 1000);
  });
});