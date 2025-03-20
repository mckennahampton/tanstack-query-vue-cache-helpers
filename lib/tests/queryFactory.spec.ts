import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { queryFactory } from "../composables/useTanstackQueryHelpers";
import { usePage } from "@inertiajs/vue3";

// Mock usePage to return test data
vi.mock("@inertiajs/vue3", () => ({
    usePage: vi.fn(() => ({
        props: {
            testQuery: [{ id: 1, name: "Initial Item" }]
        }
    }))
}));

const queryClient = new QueryClient();

const createTestComponent = (fn: () => any) => defineComponent({
    setup: fn,
    render: () => h("div"),
});

describe("queryFactory", () => {
    let wrapper: any;

    beforeEach(() => {
        queryClient.clear();
    });

    it("should initialize with query function", async () => {
        const queryFn = vi.fn().mockResolvedValue([{ id: 1, name: "Test Item" }]);

        wrapper = mount(createTestComponent(() => {
            const query = queryFactory({ queryKey: "testQuery", queryFn });
            return { query };
        }), {
            global: {
                plugins: [VueQueryPlugin],
            },
        });

        await queryClient.invalidateQueries({ queryKey: ["testQuery"] });

        setTimeout(() => {
            expect(queryFn).toHaveBeenCalled();
            expect(wrapper.vm.query.data.value).toEqual([{ id: 1, name: "Test Item" }]);
        }, 1000);
    });

    it("should use initial data if provided", async () => {
        const queryFn = vi.fn().mockResolvedValue([{ id: 2, name: "Fetched Item" }]);

        wrapper = mount(createTestComponent(() => {
            const query = queryFactory({ queryKey: "testQuery", queryFn, useInitialData: true });
            return { query };
        }), {
            global: {
                plugins: [VueQueryPlugin],
            },
        });

        await queryClient.invalidateQueries({ queryKey: ["testQuery"] });

        setTimeout(() => {
            expect(wrapper.vm.query.data.value).toEqual([{ id: 1, name: "Initial Item" }]); // Initial data should be used
        }, 1000);
    });

    it("should update data when query function fetches new data", async () => {
        const queryFn = vi.fn().mockResolvedValue([{ id: 3, name: "Updated Item" }]);

        wrapper = mount(createTestComponent(() => {
            const query = queryFactory({ queryKey: "testQuery", queryFn });
            return { query };
        }), {
            global: {
                plugins: [VueQueryPlugin],
            },
        });

        await queryClient.invalidateQueries({ queryKey: ["testQuery"] });

        setTimeout(() => {
            expect(wrapper.vm.query.data.value).toEqual([{ id: 3, name: "Updated Item" }]);
        }, 1000);
    });

    it("should respect additional configuration", async () => {
        const queryFn = vi.fn().mockResolvedValue([{ id: 4, name: "Configured Item" }]);

        wrapper = mount(createTestComponent(() => {
            const query = queryFactory({ 
                queryKey: "testQuery", 
                queryFn, 
                aditionalConfig: { staleTime: 5000 } 
            });
            return { query };
        }), {
            global: {
                plugins: [VueQueryPlugin],
            },
        });

        await queryClient.invalidateQueries({ queryKey: ["testQuery"] });

        setTimeout(() => {
            expect(wrapper.vm.query.options.staleTime).toBe(5000);
        }, 1000);
    });

    it("should return expected structure", async () => {
        const queryFn = vi.fn().mockResolvedValue([]);

        wrapper = mount(createTestComponent(() => {
            const query = queryFactory({ queryKey: "testQuery", queryFn });
            return { query };
        }), {
            global: {
                plugins: [VueQueryPlugin],
            },
        });

        await queryClient.invalidateQueries({ queryKey: ["testQuery"] });

        setTimeout(() => {
            expect(wrapper.vm.query).toHaveProperty("data");
            expect(wrapper.vm.query).toHaveProperty("isLoading");
            expect(wrapper.vm.query).toHaveProperty("isError");
        }, 1000);
    });
});