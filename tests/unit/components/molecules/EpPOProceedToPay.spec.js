import { assert } from 'chai'
import EpPOProceedToPay from '@/components/molecules/EpPOProceedToPay.vue'
import { shallowMount } from '@vue/test-utils'

describe('<EpPOProceedToPay />', () => {
  it('should render title', async () => {
    const wrapper = await shallowMount(EpPOProceedToPay)
    const text = wrapper.find('[data-testid="headtitle"]').text()
    assert.equal(text, 'Proceed to Pay')
  })
  it('should render sub title', async () => {
    const wrapper = await shallowMount(EpPOProceedToPay, {
      props: {
        isOpen: true
      }
    })
    const text = wrapper.find('[data-testid="subtitle"]').text()
    assert.equal(text, 'By clicking confirm, you continue with the payment')
  })
  it('should emit click confirm event', () => {
    const wrapper = shallowMount(EpPOProceedToPay)

    const retryButton = wrapper.find('[data-testid="confirm-button"]')
    retryButton.vm.$emit('click')
    assert.equal(wrapper.emitted('confirm').length, 1)
  })
  it('should emit click discard event', () => {
    const wrapper = shallowMount(EpPOProceedToPay)

    const newpaymentButton = wrapper.find('[data-testid="discard-button"]')
    newpaymentButton.vm.$emit('click')
    assert.equal(wrapper.emitted('discard').length, 1)
  })
})
