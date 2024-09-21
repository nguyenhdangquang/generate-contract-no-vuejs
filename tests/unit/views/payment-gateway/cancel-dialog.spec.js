import sinon from 'sinon'
import PaymentGateway from '@/views/payment-gateway/Index.vue'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createStore } from '../../store-utils'
import { assert } from 'chai'
import CancelDialog from '@/components/dialog/CancelDialog.vue'
import { TransactionStatusListener } from '@/views/payment-gateway/services/transaction-status-listener'
import * as paymentTransactionRepo from '@/repositories/PaymentTransactions'
import { TRANSACTION_STATUS } from '@/views/payment-gateway/services/transaction-status'

const localVue = createAppLocalVue()

describe('<PayPO />: CancelDialog', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should not open modal initially', async () => {
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

    const cancelDialog = wrapper.findComponent(CancelDialog)
    assert.isTrue(cancelDialog.exists())
    assert.isFalse(cancelDialog.props('isOpen'))

    wrapper.vm.triggerRouterGuard()
    await wrapper.vm.$nextTick()
    assert.isTrue(cancelDialog.props('isOpen'))
  })

  it('should return true to guard when confirm cancelling', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    sinon.stub(paymentTransactionRepo, 'updateTransactionStatus')
    const store = createStore()
    const createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
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

    const cancelDialog = wrapper.findComponent(CancelDialog)
    const spiedTriggerRouterGuard = sinon.spy(wrapper.vm, 'triggerRouterGuard')
    wrapper.vm.triggerRouterGuard()
    await wrapper.vm.$nextTick()

    cancelDialog.vm.$emit('confirm')
    await wrapper.vm.$nextTick()

    assert.isTrue(spiedTriggerRouterGuard.calledOnce)
    assert.isTrue(await spiedTriggerRouterGuard.returnValues[0])
  })

  it('should update transaction status when confirm cancelling', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const stubbedUpdateTransactionStatus = sinon.stub(paymentTransactionRepo, 'updateTransactionStatus')
    const store = createStore()
    const createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
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

    const cancelDialog = wrapper.findComponent(CancelDialog)
    wrapper.vm.triggerRouterGuard()
    await wrapper.vm.$nextTick()

    cancelDialog.vm.$emit('confirm')
    await wrapper.vm.$nextTick()

    sinon.assert.calledOnceWithExactly(
      stubbedUpdateTransactionStatus,
      createdPaymentTransaction.transactionUid,
      TRANSACTION_STATUS.CANCEL_TRANSACTION
    )
  })

  it('should return false to guard when discard cancelling', async () => {
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

    const cancelDialog = wrapper.findComponent(CancelDialog)
    const spiedTriggerRouterGuard = sinon.spy(wrapper.vm, 'triggerRouterGuard')
    wrapper.vm.triggerRouterGuard()
    await wrapper.vm.$nextTick()

    cancelDialog.vm.$emit('discard')
    await wrapper.vm.$nextTick()

    assert.isTrue(spiedTriggerRouterGuard.calledOnce)
    assert.isFalse(await spiedTriggerRouterGuard.returnValues[0])
  })
})
