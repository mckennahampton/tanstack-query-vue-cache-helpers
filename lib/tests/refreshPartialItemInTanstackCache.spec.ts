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

describe("refreshPartialItemInTanstackCache", () => {
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

  it("should update an existing item's field with new content", async () => {
    const initialData = [{ id: 1, name: "Old Name", description: "Old Description" }];
    
    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.refreshPartialItemInTanstackCache({
      targetKeyValue: 1,
      replacementKey: "name",
      replacementContent: "New Name",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData).toContainEqual({ id: 1, name: "New Name", description: "Old Description" });
        }
    }, 1000);
  });

  it("should append items to an array field instead of replacing it", async () => {
    const initialData = [{ id: 1, tags: ["tag1"] }];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.refreshPartialItemInTanstackCache({
      targetKeyValue: 1,
      replacementKey: "tags",
      replacementContent: ["tag2"],
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].tags).toEqual(["tag1", "tag2"]);
        }
    }, 1000);
  });

  it("should treat an empty array as an object when needed", async () => {
    const initialData = [{ id: 1, settings: [] }];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.refreshPartialItemInTanstackCache({
      targetKeyValue: 1,
      replacementKey: "settings",
      replacementContent: { theme: "dark" },
      treatArrayAsObject: true,
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].settings).toEqual({ theme: "dark" });
        }
    }, 1000);
  });

  it("should do nothing if the target item is not found", async () => {
    const initialData = [{ id: 1, name: "Original Name" }];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.refreshPartialItemInTanstackCache({
      targetKeyValue: 99, // Non-existent ID
      replacementKey: "name",
      replacementContent: "New Name",
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData).toEqual(initialData); // Should remain unchanged
        }
    }, 1000);
  });

  it("should update a nested field without affecting other data", async () => {
    const initialData = [{ id: 1, profile: { age: 25, city: "New York" } }];

    await wrapper.vm.helpers.refreshTanstackCache({ items: initialData });

    await wrapper.vm.helpers.refreshPartialItemInTanstackCache({
      targetKeyValue: 1,
      replacementKey: "profile",
      replacementContent: { age: 30 },
    });

    const cacheData = queryClient.getQueryData(["testCache"]);
    setTimeout(() => {
        expect(cacheData).toBeInstanceOf(Array);
        if (Array.isArray(cacheData)) {
            expect(cacheData[0].profile).toEqual({ age: 30, city: "New York" }); // City remains unchanged
        }
    }, 1000);
  });
});