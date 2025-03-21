import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { VueQueryPlugin } from '@tanstack/vue-query'
import SuccessWithConfirmation from './components/mutationFactory/SuccessWithConfirmation.vue'
import CancelWithConfirmation from './components/mutationFactory/CancelWithConfirmation.vue';
import SuccessWithoutConfirmation from './components/mutationFactory/SuccessWithoutConfirmation.vue';

const pollArgs = {
    interval: 250,
    timeout: 10000,
};

describe('mutationFactory - success with confirmation', () => {
  it('mutates and calls success handler', async () => {
    const wrapper = mount(SuccessWithConfirmation, {
      global: { plugins: [VueQueryPlugin] }
    })

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.mutate()
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('First');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('Confirmed Item');
  })

  it('should be canceled, asked, and not called', async () => {
    const wrapper = mount(CancelWithConfirmation, {
      global: { plugins: [VueQueryPlugin] }
    })

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.mutate()
    await expect.poll(() => wrapper.find('[id="asked"]').text(), pollArgs).toBe("true");
    await expect.poll(() => wrapper.find('[id="called"]').text(), pollArgs).toBe("false");
    await expect.poll(() => wrapper.text(), pollArgs).toContain('First');
    await expect.poll(() => wrapper.text(), pollArgs).not.toContain('Should Not Call');
  })

  it('mutates and calls success handler without confirmation', async () => {
    const wrapper = mount(SuccessWithoutConfirmation, {
      global: { plugins: [VueQueryPlugin] }
    })

    await expect.poll(() => wrapper.vm.helpers.isQueryInitialized(), pollArgs).toBe(true);
    await wrapper.vm.mutate()
    await expect.poll(() => wrapper.text(), pollArgs).toContain('First');
    await expect.poll(() => wrapper.text(), pollArgs).toContain('No Confirm');
  })
})