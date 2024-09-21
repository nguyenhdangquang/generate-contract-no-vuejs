import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import CancelDialog from '@/components/dialog/CancelDialog.vue'
import Modal from '@/components/Modal.vue'

describe('<CancelDialog />', () => {
  it('should render title', () => {
    const wrapper = shallowMount(CancelDialog, {
      propsData: { isOpen: true }
    })

    assert.equal(wrapper.find('[data-testid="title"]').text(), 'Confirm Payment Cancellation')
  })

  it('should render message', () => {
    const wrapper = shallowMount(CancelDialog, {
      propsData: { isOpen: true }
    })

    assert.equal(wrapper.find('[data-testid="message"]').text(), 'Do you want to cancel transaction?')
  })

  it('should render discard button', () => {
    const wrapper = shallowMount(CancelDialog, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="discard-button"]')
    assert.isTrue(discardButton.isVisible())
  })

  it('should render confirm button', () => {
    const wrapper = shallowMount(CancelDialog, {
      propsData: { isOpen: true }
    })

    const confirmButton = wrapper.find('[class="confirm-button"]')
    assert.isTrue(confirmButton.isVisible())
  })

  it('should emit close event when clicking discard button', () => {
    const wrapper = shallowMount(CancelDialog, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="discard-button"]')
    discardButton.vm.$emit('click')

    assert.equal(wrapper.emitted('discard').length, 1)
  })

  it('should emit close event when clicking confirm button', () => {
    const wrapper = shallowMount(CancelDialog, {
      propsData: { isOpen: true }
    })

    const confirmButton = wrapper.find('[class="confirm-button"]')
    confirmButton.vm.$emit('click')

    assert.equal(wrapper.emitted('confirm').length, 1)
  })

  it('should emit update:isOpen event', () => {
    const wrapper = shallowMount(CancelDialog, {
      propsData: { isOpen: true }
    })

    const modalComponent = wrapper.findComponent(Modal)
    modalComponent.vm.$emit('update:isOpen', false)

    assert.equal(wrapper.emitted('update:isOpen').length, 1)
  })
})
