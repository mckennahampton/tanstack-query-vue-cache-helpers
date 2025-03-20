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

describe("removeFromTanstackCache", () => {
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

        queryClient.setQueryData(["testCache"], [{ id: 1, name: "Item to Remove" }]);
    });

    it("should remove an item from the cache", async () => {
        wrapper.vm.helpers.removeFromTanstackCache({ target: 1 });

        queryClient.invalidateQueries({ queryKey: ["testCache"] });

        setTimeout(() => {
            const data = queryClient.getQueryData(["testCache"]);
            expect(data).not.toContainEqual({ id: 1, name: "Item to Remove" });
        }, 1000);
    });
});