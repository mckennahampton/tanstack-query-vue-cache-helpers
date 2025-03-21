import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { VueQueryPlugin } from "@tanstack/vue-query";
import IsQueryInitialized from "./components/isQueryInitialized/IsQueryInitialized.vue";

const pollArgs = {
  interval: 250,
  timeout: 10000,
};

describe("isQueryInitialized", () => {
  it("returns false before query is initialized, and true after", async () => {
    const wrapper = mount(IsQueryInitialized, {
      global: { plugins: [VueQueryPlugin] },
    });

    // Should initially return false
    expect(wrapper.vm.isQueryInitialized()).toBe(false);
    expect(wrapper.find('[data-testid="status"]').text()).toBe("false");

    // Wait until the query is loaded
    await expect.poll(() => wrapper.find('[data-testid="status"]').text(), pollArgs).toBe("true");
    expect(wrapper.vm.isQueryInitialized()).toBe(true);
  });
});