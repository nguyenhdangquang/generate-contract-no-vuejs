import sinon from 'sinon'
import { TransactionStatusListener } from '@/views/payment-gateway/services/transaction-status-listener'
import PaymentGateway from '@/views/payment-gateway/Index.vue'
import { paymentGatewayHK } from '../../../../src/views/payment-gateway/mixins/payment-gateway-hk'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createStore } from '../../store-utils'
import SuccessDialog from '@/components/molecules/EpPaymentSuccess.vue'
import EpCountDown from '@/components/molecules/EpCountDown.vue'
import { assert } from 'chai'

const localVue = createAppLocalVue()
describe('<PayPO />: SuccessDialog', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should not render success dialog initially', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')

    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: '123123123',
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })

    assert.isFalse(wrapper.findComponent(SuccessDialog).exists())
  })

  it('should open success dialog when receive success event', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    const stubbedCloseListener = sinon.stub(TransactionStatusListener, 'close')
    let onMessageHandler
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      .callsFake(({
        onMessage
      }) => {
        onMessageHandler = onMessage
      })
    const stubData = {
      type: 'paymentTransaction:updateStatus',
      transactionUid: '123123123',
      status: 'success',
      payDate: new Date(),
      amount: 10.5,
      currency: 'SGD'
    }
    const stubbedEvent = {
      data: JSON.stringify(stubData)
    }

    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: stubData.transactionUid,
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })

    onMessageHandler(stubbedEvent)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const successDialog = wrapper.findComponent(SuccessDialog)

    assert.isTrue(successDialog.props('isOpen'))
    sinon.assert.calledOnce(stubbedCloseListener)
  })

  it('should open success dialog when receive success event at HK', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    const stubbedCloseListener = sinon.stub(TransactionStatusListener, 'close')
    let onMessageHandler
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      .callsFake(({
        onMessage
      }) => {
        onMessageHandler = onMessage
      })
    const stubData = {
      type: 'paymentTransaction:updateStatus',
      transactionUid: '123123123',
      status: 'success',
      payDate: new Date(),
      amount: 10.5,
      currency: 'HKD'
    }
    const stubbedEvent = {
      data: JSON.stringify(stubData)
    }

    sinon.stub()
    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        mixins: [paymentGatewayHK],
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: stubData.transactionUid,
            currency: 'HKD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'HK',
            defaultCurrency: {
              code: 'HKD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })

    onMessageHandler(stubbedEvent)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const successDialog = wrapper.findComponent(SuccessDialog)

    assert.isTrue(successDialog.props('isOpen'))
    sinon.assert.calledOnce(stubbedCloseListener)
  })

  it('should not open success modal when event includes a different transactionUid', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'close')
    let onMessageHandler
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      .callsFake(({
        onMessage
      }) => {
        onMessageHandler = onMessage
      })
    const stubData = {
      type: 'paymentTransaction:updateStatus',
      transactionUid: 'another-transaction-uid',
      status: 'success',
      payDate: new Date(),
      amount: 10.5,
      currency: 'SGD'
    }
    const stubbedEvent = {
      data: JSON.stringify(stubData)
    }

    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: 'transaction-uid',
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })

    onMessageHandler(stubbedEvent)
    await wrapper.vm.$nextTick()

    assert.isFalse(wrapper.findComponent(SuccessDialog).exists())
  })

  it('should terminal expiry countdown when open success modal', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'close')
    let onMessageHandler
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      .callsFake(({
        onMessage
      }) => {
        onMessageHandler = onMessage
      })
    const stubData = {
      type: 'paymentTransaction:updateStatus',
      transactionUid: '123123123',
      status: 'success',
      payDate: new Date(),
      amount: 10.5,
      currency: 'SGD'
    }
    const stubbedEvent = {
      data: JSON.stringify(stubData)
    }

    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: stubData.transactionUid,
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })

    onMessageHandler(stubbedEvent)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    assert.isNull(wrapper.findComponent(EpCountDown).props('expiry'))
  })

  it('should emit newPayment event when clicking new payment button', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'close')
    let onMessageHandler
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      .callsFake(({
        onMessage
      }) => {
        onMessageHandler = onMessage
      })
    const stubData = {
      type: 'paymentTransaction:updateStatus',
      transactionUid: '123123123',
      status: 'success',
      payDate: new Date(),
      amount: 10.5,
      currency: 'SGD'
    }
    const stubbedEvent = {
      data: JSON.stringify(stubData)
    }

    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: stubData.transactionUid,
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })

    onMessageHandler(stubbedEvent)
    await wrapper.vm.$nextTick()

    wrapper.findComponent(SuccessDialog).vm.$emit('newPayment')
    await wrapper.vm.$nextTick()

    assert.equal(wrapper.emitted('newPayment').length, 1)
  })

  it('should navigate to homepage when clicking homepage button', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'close')
    let onMessageHandler
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      .callsFake(({
        onMessage
      }) => {
        onMessageHandler = onMessage
      })
    const stubData = {
      type: 'paymentTransaction:updateStatus',
      transactionUid: '123123123',
      status: 'success',
      payDate: new Date(),
      amount: 10.5,
      currency: 'SGD'
    }
    const stubbedEvent = {
      data: JSON.stringify(stubData)
    }

    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: stubData.transactionUid,
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          },
          countryCode: 'sg'
        }
      })

    const routerPushStub = sinon.stub(wrapper.vm.$router, 'push')

    onMessageHandler(stubbedEvent)
    await wrapper.vm.$nextTick()

    wrapper.findComponent(SuccessDialog).vm.$emit('homePage')
    await wrapper.vm.$nextTick()

    sinon.assert.calledOnceWithExactly(routerPushStub, { name: 'Home', params: { countryCode: 'sg' } })
  })
})
