import { assert } from 'chai'
import sinon from 'sinon'
import PaymentGatewayPage from '@/views/payment-gateway/Index.vue'
import Layout from '@/components/Layout.vue'
import { TransactionStatusListener } from '@/views/payment-gateway/services/transaction-status-listener'
import { TRANSACTION_STATUS } from '@/views/payment-gateway/services/transaction-status'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import * as paymentTransactionRepository from '@/repositories/PaymentTransactions'
import BankingOnlineNote from '@/views/payment-gateway/components/BankingOnlineNote'
import { createStore } from '../../store-utils'
import { paymentGatewaySG } from '@/views/payment-gateway/mixins/payment-gateway-sg'

const localVue = createAppLocalVue()
describe('payment-gateway: index.spec', () => {
  beforeEach(() => {
    document.execCommand = sinon.stub()
  })
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render <img /> QRCode', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const propsData = {
      createdPaymentTransaction: {
        transactionUid: 'SG12312234234234',
        currency: 'SGD',
        totalLocalAmount: 123.45,
        qrCode: '123424324'
      },
      country: {
        defaultCurrency: {
          thousandSeparator: ',',
          decimalPlaces: 2
        }
      }
    }
    const wrapper = await shallowMountPage(PaymentGatewayPage, { localVue, propsData })
    const imgQrCode = wrapper.find('[data-testid="qrCodeImage"]')
    assert.isTrue(imgQrCode.isVisible())
    assert.equal(imgQrCode.attributes('width'), 280)
    assert.equal(imgQrCode.attributes('height'), 280)
    assert.equal(imgQrCode.attributes('src'), 'data:image/jpeg;base64,123424324')
  })

  it('should render total amount is zero', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const propsData = {
      createdPaymentTransaction: {
        transactionUid: 'SG12312234234234',
        currency: 'SGD',
        totalLocalAmount: 123.45,
        qrCode: '123424324'
      }
    }
    const wrapper = await shallowMountPage(PaymentGatewayPage, { localVue, propsData })
    const amountElement = wrapper.find('[data-testid="amount"]')
    assert.isTrue(amountElement.isVisible())
    assert.equal(amountElement.text(), '0')
  })

  it('should render popup of browser', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const propsData = {
      createdPaymentTransaction: {
        transactionUid: 'SG12312234234234',
        currency: 'SGD',
        totalLocalAmount: 123.45,
        qrCode: '123424324'
      },
      country: {
        defaultCurrency: {
          thousandSeparator: ',',
          decimalPlaces: 2
        }
      }
    }
    const event = {
      preventDefault: () => { return true },
      returnValue: '1234'
    }
    const spy = sinon.spy(event, 'preventDefault')
    const wrapper = await shallowMountPage(PaymentGatewayPage, { localVue, propsData })
    wrapper.vm.$data.isShowPaymentSuccess = false
    wrapper.vm.handleBeforeUnload(event)

    sinon.assert.calledOnce(spy)
    assert.equal(event.returnValue, '')
  })

  it('should not render popup of browser', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const propsData = {
      createdPaymentTransaction: {
        transactionUid: 'SG12312234234234',
        currency: 'SGD',
        totalLocalAmount: 123.45,
        qrCode: '123424324'
      },
      country: {
        defaultCurrency: {
          thousandSeparator: ',',
          decimalPlaces: 2
        }
      }
    }
    const event = {
      preventDefault: () => { return true },
      returnValue: '1234'
    }
    const spy = sinon.spy(event, 'preventDefault')
    const wrapper = await shallowMountPage(PaymentGatewayPage, { localVue, propsData })
    wrapper.vm.$data.isShowPaymentSuccess = true
    wrapper.vm.handleBeforeUnload(event)

    sinon.assert.notCalled(spy)
    assert.equal(event.returnValue, '1234')
  })

  it('should cancel transaction status and turn on changing flag', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const propsData = {
      createdPaymentTransaction: {
        transactionUid: 'SG12312234234234',
        currency: 'SGD',
        totalLocalAmount: 123.45,
        qrCode: '123424324'
      },
      country: {
        defaultCurrency: {
          thousandSeparator: ',',
          decimalPlaces: 2
        }
      }
    }

    const stub = sinon.stub(paymentTransactionRepository, 'updateTransactionStatus')
    const wrapper = await shallowMountPage(PaymentGatewayPage, { localVue, propsData })
    const layoutComponent = wrapper.findComponent(Layout)
    layoutComponent.vm.$emit('confirmChangeFlag')

    sinon.assert.calledOnce(stub)
    assert.deepEqual(stub.args, [['SG12312234234234', TRANSACTION_STATUS.CANCEL_TRANSACTION]])
    assert.isTrue(wrapper.vm.$data.isChangingFlag)
  })

  it('should render BankingOnlineNote component', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const propsData = {
      createdPaymentTransaction: {
        transactionUid: 'SG12312234234234',
        currency: 'SGD',
        totalLocalAmount: 123.45,
        qrCode: '123424324'
      },
      country: {
        defaultCurrency: {
          thousandSeparator: ',',
          decimalPlaces: 2
        }
      },
      countryCode: 'sg',
      isShowing: true
    }

    const wrapper = await shallowMountPage(PaymentGatewayPage, { localVue, propsData })
    assert.isTrue(wrapper.findComponent(BankingOnlineNote).isVisible())
  })

  it('trigger handleClickhereBankingOnlinePayNow at paymentgate SG', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGatewayPage,
      {
        localVue,
        store,
        mixins: [paymentGatewaySG],
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

    const bankingOnlineNoteComponent = wrapper.findComponent(BankingOnlineNote)
    bankingOnlineNoteComponent.vm.$emit('clickHereBankingOnlinePayNow')
    assert.equal(bankingOnlineNoteComponent.emitted('clickHereBankingOnlinePayNow').length, 1)
  })
})
