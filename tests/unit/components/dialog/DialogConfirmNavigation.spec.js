import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import DialogConfirmNavigation from '@/components/dialog/DialogConfirmNavigation.vue'

describe('<DialogConfirmNavigation />', () => {
  it('should render title', () => {
    const wrapper = shallowMount(DialogConfirmNavigation, {
      propsData: { isOpen: true }
    })

    assert.equal(wrapper.find('[data-testid="title"]').text(), 'Confirm Navigation')
  })

  it('should render message', () => {
    const wrapper = shallowMount(DialogConfirmNavigation, {
      propsData: { isOpen: true }
    })

    assert.equal(wrapper.find('[data-testid="message"]').text(), 'Do you want to leave this page?')
  })

  it('should render discard button', () => {
    const wrapper = shallowMount(DialogConfirmNavigation, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="discard-button"]')
    assert.isTrue(discardButton.isVisible())
  })

  it('should render confirm button', () => {
    const wrapper = shallowMount(DialogConfirmNavigation, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="confirm-button"]')
    assert.isTrue(discardButton.isVisible())
  })

  it('should emit close event when clicking discard button', () => {
    const wrapper = shallowMount(DialogConfirmNavigation, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="discard-button"]')
    discardButton.vm.$emit('click')

    assert.equal(wrapper.emitted('discard').length, 1)
  })

  it('should emit close event when clicking confirm button', () => {
    const wrapper = shallowMount(DialogConfirmNavigation, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="confirm-button"]')
    discardButton.vm.$emit('click')

    assert.equal(wrapper.emitted('confirm').length, 1)
  })
})
