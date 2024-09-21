import { assert } from 'chai'
import sinon from 'sinon'
import { shallowMount } from '@vue/test-utils'
import DialogConfirmChangedCountry from '@/components/dialog/DialogConfirmChangedCountry.vue'

describe('<DialogConfirmChangedCountry />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render title', () => {
    const wrapper = shallowMount(DialogConfirmChangedCountry, {
      propsData: { isOpen: true }
    })

    assert.equal(wrapper.find('[data-testid="title"]').text(), 'Confirm changing country')
  })

  it('should render message', () => {
    const wrapper = shallowMount(DialogConfirmChangedCountry, {
      propsData: { isOpen: true }
    })

    assert.equal(wrapper.find('[data-testid="message"]').text(), 'If you change the country selection, your data will be clear permanently')
  })

  it('should render discard button', () => {
    const wrapper = shallowMount(DialogConfirmChangedCountry, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="discard-button"]')
    assert.isTrue(discardButton.isVisible())
  })

  it('should render confirm button', () => {
    const wrapper = shallowMount(DialogConfirmChangedCountry, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="confirm-button"]')
    assert.isTrue(discardButton.isVisible())
  })

  it('should emit close event when clicking discard button', () => {
    const wrapper = shallowMount(DialogConfirmChangedCountry, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="discard-button"]')
    discardButton.vm.$emit('click')

    assert.equal(wrapper.emitted('discard').length, 1)
  })

  it('should emit close event when clicking confirm button', () => {
    const wrapper = shallowMount(DialogConfirmChangedCountry, {
      propsData: { isOpen: true }
    })

    const discardButton = wrapper.find('[class="confirm-button"]')
    discardButton.vm.$emit('click')

    assert.equal(wrapper.emitted('confirm').length, 1)
  })
})
