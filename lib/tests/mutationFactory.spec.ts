import { mount } from "@vue/test-utils";
import { defineComponent, h, ref, type Ref } from "vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { mutationFactory } from "../composables/useTanstackQueryHelpers";
import { type MaybeRefDeep } from "../../node_modules/@tanstack/vue-query/build/modern/types"


const queryClient = new QueryClient();

// Utility to create a Vue component for testing
const createTestComponent = (fn: () => any) =>
  defineComponent({
    setup: fn,
    render: () => h("div"),
  });

describe("mutationFactory", () => {
  let wrapper: any;
  let mutateFn: <D, T>(data: D) => Promise<T>
  let onSuccessFn: MaybeRefDeep<<D>(data: any, variables: D, context: unknown) => unknown>
  let confirmFn = vi.fn((data, loading) => Promise.resolve(true));

  beforeEach(() => {
    queryClient.clear();

    mutateFn = vi.fn().mockResolvedValue({ id: 1, name: "Test Item" });
    onSuccessFn = vi.fn();
    confirmFn = vi.fn().mockResolvedValue(true); // Default to confirm always returning true

    wrapper = mount(
      createTestComponent(() => {
        const mutation = mutationFactory({
          mutationFn: mutateFn,
          onSuccessFn,
          confirm: confirmFn,
        });
        return { mutation };
      }),
      {
        global: {
          plugins: [VueQueryPlugin],
        },
      }
    );
  });

  it("should call mutation function and onSuccess when confirmed", async () => {
    await wrapper.vm.mutation.mutateAsync({ name: "New Item" });

    setTimeout(() => {
        expect(confirmFn).toHaveBeenCalledWith(
            { name: "New Item" },
            expect.any(Object)
          );
          expect(mutateFn).toHaveBeenCalledWith({ name: "New Item" });
          expect(onSuccessFn).toHaveBeenCalledWith(
            { id: 1, name: "Test Item" }, // Result of mutation
            { name: "New Item" }, // Input to mutation
            expect.anything() // Context
          );
    }, 1000);
  });

  it("should not call mutation function if confirmation is rejected", async () => {
    confirmFn.mockImplementation(() => Promise.resolve(false)); // Simulate user rejecting confirmation

    await wrapper.vm.mutation.mutateAsync({ name: "New Item" });

    setTimeout(() => {
        expect(confirmFn).toHaveBeenCalled();
        expect(mutateFn).not.toHaveBeenCalled();
        expect(onSuccessFn).not.toHaveBeenCalled();
    }, 1000);
  });

  it("should still work without a confirmation function", async () => {
    wrapper = mount(
      createTestComponent(() => {
        const mutation = mutationFactory({
          mutationFn: mutateFn,
          onSuccessFn,
        });
        return { mutation };
      }),
      {
        global: {
          plugins: [VueQueryPlugin],
        },
      }
    );

    await wrapper.vm.mutation.mutateAsync({ name: "New Item" });

    setTimeout(() => {
        expect(mutateFn).toHaveBeenCalled();
        expect(onSuccessFn).toHaveBeenCalled();
    }, 1000)
  });

  it("should correctly update loading state", async () => {
    const loadingRef = ref(false);

    wrapper = mount(
      createTestComponent(() => {
        const mutation = mutationFactory({
          mutationFn: async (data) => {
            loadingRef.value = true;
            await new Promise((resolve) => setTimeout(resolve, 50));
            loadingRef.value = false;
            return { id: 2, name: "Updated Item" };
          },
          onSuccessFn,
          confirm: confirmFn,
        });
        return { mutation, loadingRef };
      }),
      {
        global: {
          plugins: [VueQueryPlugin],
        },
      }
    );

    const mutationPromise = wrapper.vm.mutation.mutateAsync({ name: "New Item" });

    setTimeout(async () => {
        expect(wrapper.vm.loadingRef).toBe(true);
        await mutationPromise;
        expect(wrapper.vm.loadingRef).toBe(false);
    }, 1000);
  });
});
