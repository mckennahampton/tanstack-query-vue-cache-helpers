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

describe("clearTanstackCache", () => {
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

        queryClient.setQueryData(["testCache"], [{ id: 1, name: "Test Item" }]);
    });

    it("should clear the cache", async () => {
        wrapper.vm.helpers.clearTanstackCache();

        queryClient.invalidateQueries({ queryKey: ["testCache"] });

        setTimeout(() => {
            const data = queryClient.getQueryData(["testCache"]);
            expect(data).toEqual([]);
        }, 1000);
    });
});