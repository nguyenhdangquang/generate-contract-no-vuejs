import { assert } from 'chai'
import EpQrCodeExpired from '@/components/molecules/EpQrCodeExpired.vue'
import { shallowMount } from '@vue/test-utils'

describe('<EpQrCodeExpired />', () => {
  it('should render title', async () => {
    const wrapper = await shallowMount(EpQrCodeExpired, {
      propsData: {
        isOpen: false
      }
    })
    const text = wrapper.find('[data-testid="headtitle"]').text()
    assert.equal(text, 'Your QR code is expired')
  })

  it('should render sub title', async () => {
    const wrapper = await shallowMount(EpQrCodeExpired, {
      propsData: {
        isOpen: true
      }
    })
    const text = wrapper.find('[data-testid="subtitle"]').text()
    assert.equal(text, 'You can click Retry to regenerate QR code')
  })

  it('should emit click retry event', () => {
    const wrapper = shallowMount(EpQrCodeExpired, {
      propsData: {
        isOpen: true
      }
    })

    const retryButton = wrapper.find('[data-testid="retry-button"]')
    retryButton.vm.$emit('click')
    assert.equal(wrapper.emitted('retry').length, 1)
  })

  it('should emit click newpayment event', () => {
    const wrapper = shallowMount(EpQrCodeExpired, {
      propsData: {
        isOpen: true
      }
    })

    const newpaymentButton = wrapper.find('[data-testid="newpayment-button"]')
    newpaymentButton.vm.$emit('click')
    assert.equal(wrapper.emitted('newPayment').length, 1)
  })
})
