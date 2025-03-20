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

describe("refreshDeepItemInTanstackCache", () => {
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

  it("should update an existing deep item", async () => {
    const initialData = [
      {
        id: 1,
        name: "Parent",
        children: [{ id: 2, name: "Child 1" }],
      },
    ];

    const updatedChild = { id: 2, name: "Updated Child 1" };

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });
    await wrapper.vm.helpers.refreshDeepItemInTanstackCache({
      item: updatedChild,
      childKey: "children",
      parentKey: "id",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].children).toContainEqual(updatedChild);
        }
    }, 1000);
  });

  it("should insert a new deep item if it does not exist", async () => {
    const initialData = [
      {
        id: 1,
        name: "Parent",
        children: [{ id: 2, name: "Child 1" }],
      },
    ];

    const newChild = { id: 3, name: "New Child" };

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });
    await wrapper.vm.helpers.refreshDeepItemInTanstackCache({
      item: newChild,
      childKey: "children",
      parentKey: "id",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].children).toContainEqual(newChild);
        }
    }, 1000);
  });

  it("should not modify cache if the item is identical", async () => {
    const initialData = [
      {
        id: 1,
        name: "Parent",
        children: [{ id: 2, name: "Child 1" }],
      },
    ];

    const identicalChild = { id: 2, name: "Child 1" };

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });
    await wrapper.vm.helpers.refreshDeepItemInTanstackCache({
      item: identicalChild,
      childKey: "children",
      parentKey: "id",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toEqual(initialData);
    }, 1000);
  });

  it("should add root-level items if parentKey is null", async () => {
    const newRootItem = { id: 10, name: "New Root Item" };

    await wrapper.vm.helpers.refreshDeepItemInTanstackCache({
      item: newRootItem,
      childKey: "children",
      parentKey: null,
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toContainEqual(newRootItem);
    }, 1000);
  });
});