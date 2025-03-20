import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, it, expect, beforeEach } from "vitest";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { useTanstackCacheHelpers } from "../composables/useTanstackQueryHelpers";

const queryClient = new QueryClient();

const createTestComponent = (fn: () => any) => defineComponent({
    setup: fn,
    render: () => h("div"),
});

describe("updateItemInTanstackCache", () => {
    let wrapper: any;
    
    beforeEach(() => {
        queryClient.clear();
        wrapper = mount(createTestComponent(() => {
            const helpers = useTanstackCacheHelpers("testCache");
            return { helpers };
        }), {
            global: {
                plugins: [VueQueryPlugin],
            },
        });

        queryClient.setQueryData(["testCache"], [{ id: 1, name: "Old Item" }]);
    });

    it("should update an existing item in the cache", async () => {
        const updatedItem = { id: 1, name: "Updated Item" };

        wrapper.vm.helpers.updateItemInTanstackCache({ item: updatedItem });

        queryClient.invalidateQueries({ queryKey: ["testCache"] });

        setTimeout(() => {
            const data = queryClient.getQueryData(["testCache"]);
            expect(data).toContainEqual(updatedItem);
        }, 1000);
    });
});