import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
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

describe("removeDeepItemFromTanstackCache", () => {
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

  it("should remove an existing deep item", async () => {
    const initialData = [
      {
        id: 1,
        name: "Parent",
        children: [
          { id: 2, name: "Child 1" },
          { id: 3, name: "Child 2" },
        ],
      },
    ];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.removeDeepItemFromTanstackCache({
      targetKeyValue: 2, // ID of the item to remove
      childKey: "children",
      parentKey: "id",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].children).not.toContainEqual({ id: 2, name: "Child 1" });
            expect(cacheData[0].children).toContainEqual({ id: 3, name: "Child 2" }); // Ensure the other child remains
        }
    }, 1000);

  });

  it("should do nothing if the deep item does not exist", async () => {
    const initialData = [
      {
        id: 1,
        name: "Parent",
        children: [{ id: 2, name: "Child 1" }],
      },
    ];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.removeDeepItemFromTanstackCache({
      targetKeyValue: 99, // Non-existent ID
      childKey: "children",
      parentKey: "id",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toEqual(initialData); // Should remain unchanged
    }, 1000);
  });

  it("should not affect unrelated items", async () => {
    const initialData = [
      {
        id: 1,
        name: "Parent 1",
        children: [{ id: 2, name: "Child 1" }],
      },
      {
        id: 10,
        name: "Parent 2",
        children: [{ id: 11, name: "Child 2" }],
      },
    ];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.removeDeepItemFromTanstackCache({
      targetKeyValue: 2, // Remove from first parent
      childKey: "children",
      parentKey: "id",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].children).toEqual([]); // First parent's children should be empty
            expect(cacheData[1].children).toContainEqual({ id: 11, name: "Child 2" }); // Second parent should be unchanged
        }
    }, 1000);

  });

  it("should remove an item from multiple levels of nesting", async () => {
    const initialData = [
      {
        id: 1,
        name: "Parent",
        children: [
          {
            id: 2,
            name: "Child 1",
            children: [{ id: 4, name: "Grandchild 1" }],
          },
        ],
      },
    ];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.removeDeepItemFromTanstackCache({
      targetKeyValue: 4, // Remove deep nested item
      childKey: "children",
      parentKey: "id",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].children[0].children).not.toContainEqual({
                id: 4,
                name: "Grandchild 1",
              });
              expect(cacheData[0].children[0].children).toEqual([]); // Ensure empty array after removal
        }
    }, 1000);
  });
});