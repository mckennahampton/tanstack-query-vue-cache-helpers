import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import RemoveOneItemAndLeaveOneItem from "./components/removeFromTanstackCache/RemoveOneItemAndLeaveOneItem.vue";
/**  
 * Working with the Tanstack Query Cache in the Vitest environment
 * takes a wide range of varrying times to complete. The only
 * way to ensure that the test waits for everything to complete
 * is to use the `await expect.poll` method. This method will
 * poll the function passed to it until the function returns
 * the expected value or the timeout is reached.
 * 
 * Also, Tanstack Query Cache does not seem to play well unless
 * the entire process is completed in a SFC combined with polling.
 */

describe('removeFromTanstackCache Component', () => {
    it('Component test', async() => {
        const wrapper = mount(RemoveOneItemAndLeaveOneItem, {
            global: {
                plugins: [VueQueryPlugin],
            },
        });

        await expect.poll(() => wrapper.text(), {
            interval: 250,
            timeout: 100000,
        }).toContain('Item to Keep');

        await expect.poll(() => {
            wrapper.vm.removeItem()
            return wrapper.text()
        }, {
            interval: 250,
            timeout: 100000,
        }).not.toContain('Item to Remove');
    });
});