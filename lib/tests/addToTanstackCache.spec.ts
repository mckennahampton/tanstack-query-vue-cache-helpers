import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h } from 'vue'
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

describe("Add Item", () => {
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
    })

    it("should add an item to the cache", async () => {
        const item = { id: 1, name: "Test Item" };
    
        wrapper?.vm.helpers.addToTanstackCache({ items: [item] });
    
        queryClient.invalidateQueries({ queryKey: ["testCache"] });
    
        const data = queryClient.getQueryData(["testCache"]);
    
        setTimeout(() => {
            expect(data).not.toBeUndefined();
            expect(data).toBeInstanceOf(Array);
            expect(data).toContainEqual(item);
        }, 1000)
      });
})