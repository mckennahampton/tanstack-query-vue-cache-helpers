import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import RemoveOneItem from "./components/removeFromTanstackCache/RemoveOneItem.vue"
import RemoveMultipleItems from "./components/removeFromTanstackCache/RemoveMultipleItems.vue";
import RemoveCustomKey from "./components/removeFromTanstackCache/RemoveCustomKey.vue";
import RemoveMissingItem from "./components/removeFromTanstackCache/RemoveMissingItem.vue";
import RemoveFromEmptyCache from "./components/removeFromTanstackCache/RemoveFromEmptyCache.vue";
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
const pollArgs = {
    interval: 250,
    timeout: 100000,
}
describe('removeFromTanstackCache tests', () => {
    it('Removes one item and leaves one item', async() => {
        const wrapper = mount(RemoveOneItem, {
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

    it('Removes multiple items leaving one', async() => {
        const wrapper = mount(RemoveMultipleItems, {
            global: {
                plugins: [VueQueryPlugin],
            },
        });

        // Initial State
        await expect.poll(() => wrapper.text(), pollArgs).toContain('Remove A');
        await expect.poll(() => wrapper.text(), pollArgs).toContain('Remove B');
        await expect.poll(() => wrapper.text(), pollArgs).toContain('Keep C');

        // Remove A
        wrapper.vm.remove1()
        await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Remove A');
        await expect.poll(() => wrapper.text(), pollArgs).toContain('Remove B');
        await expect.poll(() => wrapper.text(), pollArgs).toContain('Keep C');

        // Remove B
        wrapper.vm.remove2()
        await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Remove A');
        await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Remove B');
        await expect.poll(() => wrapper.text(), pollArgs).toContain('Keep C');
    });

    it("removes item using custom identityKey", async () => {
        const wrapper = mount(RemoveCustomKey, {
            global: { plugins: [VueQueryPlugin] },
        });
    
        // Wait for initial render
        await expect.poll(() => wrapper.text(), pollArgs).toContain("Keep Item");
        await expect.poll(() => wrapper.text(), pollArgs).toContain("Remove Me");
    
        // Trigger remove
        await wrapper.vm.removeCustom();
        await expect.poll(() => wrapper.text(), pollArgs).not.toContain("Remove Me");
        await expect.poll(() => wrapper.text(), pollArgs).toContain("Keep Item");
    });
    
    it("handles removing an item that does not exist", async () => {
        const wrapper = mount(RemoveMissingItem, {
            global: { plugins: [VueQueryPlugin] },
        });
    
        // Confirm item is present
        await expect.poll(() => wrapper.text(), pollArgs).toContain("Still Here");
    
        // Attempt to remove non-existent item
        await wrapper.vm.removeMissing();
    
        // Should still contain the existing item, nothing crashes
        await expect.poll(() => wrapper.text(), pollArgs).toContain("Still Here");
    });

    it("gracefully handles removing from an empty cache", async () => {
        const wrapper = mount(RemoveFromEmptyCache, {
          global: { plugins: [VueQueryPlugin] },
        });
    
        // Initial state is just placeholder text
        await expect.poll(() => wrapper.text(), pollArgs).toContain("No Items");
    
        // Remove from empty list (should not throw)
        await wrapper.vm.removeFromEmpty();
    
        // Nothing should change
        await expect.poll(() => wrapper.text(), pollArgs).toContain("No Items");
      });
});