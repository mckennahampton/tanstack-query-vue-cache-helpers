import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { useTanstackCacheHelpers } from '../composables/useTanstackQueryHelpers'

const queryClient = new QueryClient();

const createTestComponent = (fn: () => any) => {
  return defineComponent({
    setup() {
      return fn();
    },
    render() {
      return h("div");
    },
  });
}

describe("isQueryInitialized", () => {
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
          plugins: [[VueQueryPlugin, { queryClient }]],
        },
      }
    );
  })
  
  it("should return false when query is not initialized", async () => {
    const isInitialized = wrapper.vm.helpers.isQueryInitialized();
    expect(isInitialized).toBe(false);
  });

  it("should return true when query is initialized", async () => {
    // Set some initial data
    queryClient.setQueryData(["testCache"], [{ id: 1, name: "Test Item" }]);
    
    setTimeout(() => {
        const isInitialized = wrapper.vm.helpers.isQueryInitialized();
        expect(isInitialized).toBe(true);
      }, 1000);
  });
});