import sinon from 'sinon'
import PaymentGateway from '@/views/payment-gateway/Index.vue'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createStore } from '../../store-utils'
import { assert } from 'chai'
import EpCountDown from '@/components/molecules/EpCountDown.vue'
import { TransactionStatusListener } from '@/views/payment-gateway/services/transaction-status-listener'
import * as paymentTransactionRepo from '@/repositories/PaymentTransactions'
import { TRANSACTION_STATUS } from '@/views/payment-gateway/services/transaction-status'
import EpQrCodeExpired from '@/components/molecules/EpQrCodeExpired.vue'
import CancelDialog from '@/components/dialog/CancelDialog.vue'

const localVue = createAppLocalVue()

describe('<PayPO />: CountDown', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render CountDown component', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const store = createStore()
    const qrCodeExpiry = new Date().toUTCString()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: '123123123',
            currency: 'SGD',
            totalLocalAmount: 12000.22,
            qrCodeExpiry
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

    const countdown = wrapper.findComponent(EpCountDown)

    assert.equal(countdown.props('expiry'), qrCodeExpiry)
  })

  it('should update transaction status when expired', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const stubbedUpdateTransactionStatus = sinon.stub(paymentTransactionRepo, 'updateTransactionStatus')
    const store = createStore()
    const qrCodeExpiry = new Date().toUTCString()
    const createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22,
      qrCodeExpiry
    }
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction,
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

    const countdown = wrapper.findComponent(EpCountDown)
    countdown.vm.$emit('timeout')
    await wrapper.vm.$nextTick()

    sinon.assert.calledOnceWithExactly(
      stubbedUpdateTransactionStatus,
      createdPaymentTransaction.transactionUid,
      TRANSACTION_STATUS.QR_CODE_EXPIRED
    )
  })

  describe('<EpQrCodeExpired />', () => {
    it('should render EpQrCodeExpired', async () => {
      sinon.stub(TransactionStatusListener, 'startListener')
      sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      const store = createStore()
      const qrCodeExpiry = new Date().toUTCString()
      const wrapper = await shallowMountPage(
        PaymentGateway,
        {
          localVue,
          store,
          propsData: {
            createdPaymentTransaction: {
              transactionUid: '123123123',
              currency: 'SGD',
              totalLocalAmount: 12000.22,
              qrCodeExpiry
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

      const qrCodeExpired = wrapper.findComponent(EpQrCodeExpired)
      assert.isFalse(qrCodeExpired.props('isOpen'))
    })

    it('should open EpQrCodeExpired when expires', async () => {
      sinon.stub(TransactionStatusListener, 'startListener')
      sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      sinon.stub(paymentTransactionRepo, 'updateTransactionStatus')
      const store = createStore()
      const qrCodeExpiry = new Date().toUTCString()
      const createdPaymentTransaction = {
        transactionUid: '123123123',
        currency: 'SGD',
        totalLocalAmount: 12000.22,
        qrCodeExpiry
      }
      const wrapper = await shallowMountPage(
        PaymentGateway,
        {
          localVue,
          store,
          propsData: {
            createdPaymentTransaction,
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

      const countdown = wrapper.findComponent(EpCountDown)
      countdown.vm.$emit('timeout')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const qrCodeExpired = wrapper.findComponent(EpQrCodeExpired)
      const cancelDialog = wrapper.findComponent(CancelDialog)
      assert.isTrue(qrCodeExpired.props('isOpen'))
      assert.isFalse(cancelDialog.props('isOpen'))
    })

    it('should not open EpQrCodeExpired when payment successfully', async () => {
      sinon.stub(window, 'scrollTo')
      sinon.stub(TransactionStatusListener, 'startListener')
      sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      sinon.stub(paymentTransactionRepo, 'updateTransactionStatus')
      const store = createStore()
      const qrCodeExpiry = new Date().toUTCString()
      const createdPaymentTransaction = {
        transactionUid: '123123123',
        currency: 'SGD',
        totalLocalAmount: 12000.22,
        qrCodeExpiry
      }
      const wrapper = await shallowMountPage(
        PaymentGateway,
        {
          localVue,
          store,
          propsData: {
            createdPaymentTransaction,
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

      wrapper.vm.$data.isShowPaymentSuccess = true
      const countdown = wrapper.findComponent(EpCountDown)
      countdown.vm.$emit('timeout')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const qrCodeExpired = wrapper.findComponent(EpQrCodeExpired)
      const cancelDialog = wrapper.findComponent(CancelDialog)
      assert.isFalse(qrCodeExpired.props('isOpen'))
      assert.isFalse(cancelDialog.props('isOpen'))
    })

    it('should close EpQrCodeExpired when retrying', async () => {
      sinon.stub(window, 'scrollTo')
      sinon.stub(TransactionStatusListener, 'startListener')
      sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      sinon.stub(paymentTransactionRepo, 'updateTransactionStatus')
      const store = createStore()
      const qrCodeExpiry = new Date().toUTCString()
      const createdPaymentTransaction = {
        transactionUid: '123123123',
        currency: 'SGD',
        totalLocalAmount: 12000.22,
        qrCodeExpiry
      }
      const wrapper = await shallowMountPage(
        PaymentGateway,
        {
          localVue,
          store,
          propsData: {
            createdPaymentTransaction,
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

      const countdown = wrapper.findComponent(EpCountDown)
      countdown.vm.$emit('timeout')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      let qrCodeExpired = wrapper.findComponent(EpQrCodeExpired)
      qrCodeExpired.vm.$emit('retry')
      await wrapper.vm.$nextTick()

      qrCodeExpired = wrapper.findComponent(EpQrCodeExpired)
      assert.isFalse(qrCodeExpired.props('isOpen'))
      assert.equal(wrapper.emitted('retry').length, 1)
    })

    it('should handle to new payment when payment was expired', async () => {
      sinon.stub(window, 'scrollTo')
      sinon.stub(TransactionStatusListener, 'startListener')
      sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
      sinon.stub(paymentTransactionRepo, 'updateTransactionStatus')
      const store = createStore()
      const qrCodeExpiry = new Date().toUTCString()
      const createdPaymentTransaction = {
        transactionUid: '123123123',
        currency: 'SGD',
        totalLocalAmount: 12000.22,
        qrCodeExpiry
      }
      const wrapper = await shallowMountPage(
        PaymentGateway,
        {
          localVue,
          store,
          propsData: {
            createdPaymentTransaction,
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

      wrapper.vm.$data.isExpiredModalOpen = true
      const cancelButtonElement = wrapper.find('[data-testid="cancelButton"]')
      cancelButtonElement.trigger('click')
      await wrapper.vm.$nextTick()

      assert.equal(wrapper.emitted('newPayment').length, 1)
    })
  })
})
