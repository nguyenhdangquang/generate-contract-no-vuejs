import { assert } from 'chai'
import EpPaymentSuccess from '@/components/molecules/EpPaymentSuccess.vue'
import { shallowMount } from '@vue/test-utils'
import { createAppLocalVue } from '../../utils'

describe('<EpPaymentSuccess />', () => {
  const localVue = createAppLocalVue()

  it('should render text', async () => {
    const wrapper = shallowMount(EpPaymentSuccess, {
      localVue,
      propsData: {
        isOpen: true,
        payDate: '2021-03-25T12:03:43+08:00',
        amount: 10.5, // '10.50'
        currency: 'SGD',
        transactionUid: 'sample-transaction-uid',
        country: {
          code: 'SG',
          defaultCurrency: {
            thousandSeparator: ',',
            decimalPlaces: 2
          }
        }
      }
    })
    await wrapper.vm.$nextTick()

    const totalAmountText = wrapper.find('.payment-success-total-amount').text()
    const createAtText = wrapper.find('.payment-success-create-at').text()
    const transactionIdText = wrapper.find('.payment-success-transaction-id').text()

    assert.equal(totalAmountText, 'SGD 10.50')
    assert.equal(createAtText, '2021-Mar-25 12:03:43 (GMT+8)')
    assert.equal(transactionIdText, 'Transaction ID: sample-transaction-uid')
  })

  it('should emit click New Payment button', () => {
    const wrapper = shallowMount(EpPaymentSuccess, {
      localVue,
      propsData: {
        isOpen: true,
        payDate: new Date(2021, 1, 12, 9, 9, 12).toUTCString(),
        amount: 10.5, // '10.50'
        currency: 'SGD',
        transactionUid: 'sample-transaction-uid',
        country: {
          code: 'SG',
          defaultCurrency: {
            thousandSeparator: ',',
            decimalPlaces: 2
          }
        }
      }
    })

    const newPaymentButton = wrapper.find('.new-payment')
    newPaymentButton.vm.$emit('click')
    assert.equal(wrapper.emitted('newPayment').length, 1)
  })

  it('should emit click Home Page button', () => {
    const wrapper = shallowMount(EpPaymentSuccess, {
      localVue,
      propsData: {
        isOpen: true,
        payDate: new Date(2021, 1, 12, 9, 9, 12).toUTCString(),
        amount: 10.5, // '10.50'
        currency: 'SGD',
        transactionUid: 'sample-transaction-uid',
        country: {
          code: 'SG',
          defaultCurrency: {
            thousandSeparator: ',',
            decimalPlaces: 2
          }
        }
      }
    })

    const homePageButton = wrapper.find('.home-page')
    homePageButton.vm.$emit('click')
    assert.equal(wrapper.emitted('homePage').length, 1)
  })

  it('should return 0 when country is null', async () => {
    const wrapper = shallowMount(EpPaymentSuccess, {
      localVue,
      propsData: {
        isOpen: true,
        payDate: '2021-03-25T12:03:43+08:00',
        amount: 10.5, // '10.50'
        currency: 'SGD',
        transactionUid: 'sample-transaction-uid',
        country: null
      }
    })
    await wrapper.vm.$nextTick()

    const totalAmountText = wrapper.find('.payment-success-total-amount').text()
    assert.equal(totalAmountText, 'SGD 0')
  })
})
