import sinon from 'sinon'
import { assert } from 'chai'
import PayPOPage from '@/views/pay-po/Index.vue'
import StorageHelper from '@/utils/storageHelper'
import PaymentGateway from '@/views/payment-gateway/Index.vue'
import BankingOnlinePayNow from '@/views/payment-gateway/components/BankingOnlinePayNow'
import { TransactionStatusListener } from '@/views/payment-gateway/services/transaction-status-listener'
import { createMockApplicationModule, createMockSettingsModule, createStore } from '../../store-utils'
import { createAppLocalVue, mountPage, shallowMountPage } from '../../utils'
import { PAYMENT_GATEWAY_METHOD } from '@/utils/constants'

const localVue = createAppLocalVue()
const baseSettings = {
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

describe('<PayPO />: PaymentGateway', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  // beforeEach(() => {
  //   sinon.stub(LocalStorageHelper, 'getCountryCode').returns('SG')
  // })

  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should not render PaymentGateway initially', async () => {
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    assert.isFalse(wrapper.findComponent(PaymentGateway).exists())
  })

  it('should render PaymentGateway when payment transaction is created and getPaymentGatewayMethod is qrCode', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const getPaymentGatewayMethodStub = sinon.stub().returns(PAYMENT_GATEWAY_METHOD.QR_CODE)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })

    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: getPaymentGatewayMethodStub
      }
    })

    const store = createStore({
      settingsModule,
      applicationModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
    }
    await wrapper.vm.$nextTick()

    assert.isTrue(wrapper.findComponent(PaymentGateway).exists())
  })

  it('should render BankingOnlinePayNow when payment transaction is created and getPaymentGatewayMethod is onlineBanking', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const getPaymentGatewayMethodStub = sinon.stub().returns(PAYMENT_GATEWAY_METHOD.ONLINE_BANKING_PAYNOW)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })

    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: getPaymentGatewayMethodStub
      }
    })

    const store = createStore({
      settingsModule,
      applicationModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
    }
    await wrapper.vm.$nextTick()

    assert.isTrue(wrapper.findComponent(BankingOnlinePayNow).exists())
  })

  it('should trigger navigation guard when navigating away from PaymentGateway', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const getPaymentGatewayMethodStub = sinon.stub().returns(PAYMENT_GATEWAY_METHOD.QR_CODE)

    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: getPaymentGatewayMethodStub
      }
    })
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule,
      applicationModule
    })
    const wrapper = await mountPage(PayPOPage, { localVue, store })
    const mockTo = {
      path: '/'
    }
    const mockFrom = {
      path: '/pay-po'
    }
    const stubNext = sinon.stub()

    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
    }
    await wrapper.vm.$nextTick()

    const paymentGateway = wrapper.findComponent(PaymentGateway)
    const stubbedRouterGuard = sinon.stub(paymentGateway.vm, 'triggerRouterGuard').resolves(true)

    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
    await beforeRouteLeave.call(wrapper.vm, mockTo, mockFrom, stubNext)

    assert.isTrue(stubbedRouterGuard.calledOnce)
    assert.isTrue(stubNext.calledOnce)
  })

  it('not navigate when failed router guard', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const getPaymentGatewayMethodStub = sinon.stub().returns(PAYMENT_GATEWAY_METHOD.QR_CODE)
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: getPaymentGatewayMethodStub
      }
    })
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule,
      applicationModule
    })
    const wrapper = await mountPage(PayPOPage, { localVue, store })
    const mockTo = {
      path: '/'
    }
    const mockFrom = {
      path: '/pay-po'
    }
    const stubNext = sinon.stub()

    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
    }
    await wrapper.vm.$nextTick()

    const paymentGateway = wrapper.findComponent(PaymentGateway)
    const shouldNavigate = false
    const stubbedRouterGuard = sinon.stub(paymentGateway.vm, 'triggerRouterGuard').resolves(shouldNavigate)

    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
    await beforeRouteLeave.call(wrapper.vm, mockTo, mockFrom, stubNext)

    assert.isTrue(stubbedRouterGuard.calledOnce)
    assert.isTrue(stubNext.calledOnce)
    assert.equal(stubNext.args[0][0], shouldNavigate)
  })

  it('should trigger navigation guard when navigating away from BankingOnlinePayNow', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const getPaymentGatewayMethodStub = sinon.stub().returns(PAYMENT_GATEWAY_METHOD.ONLINE_BANKING_PAYNOW)

    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: getPaymentGatewayMethodStub
      }
    })
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule,
      applicationModule
    })
    const wrapper = await mountPage(PayPOPage, { localVue, store })
    const mockTo = {
      path: '/'
    }
    const mockFrom = {
      path: '/pay-po'
    }
    const stubNext = sinon.stub()

    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
    }
    await wrapper.vm.$nextTick()

    const bankingOnlinePayNow = wrapper.findComponent(BankingOnlinePayNow)
    const stubbedRouterGuard = sinon.stub(bankingOnlinePayNow.vm, 'triggerRouterGuard').resolves(true)

    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
    await beforeRouteLeave.call(wrapper.vm, mockTo, mockFrom, stubNext)

    assert.isTrue(stubbedRouterGuard.calledOnce)
    assert.isTrue(stubNext.calledOnce)
  })

  it('not navigate when failed router guard from BankingOnlinePayNow', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const getPaymentGatewayMethodStub = sinon.stub().returns(PAYMENT_GATEWAY_METHOD.ONLINE_BANKING_PAYNOW)
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: getPaymentGatewayMethodStub
      }
    })
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule,
      applicationModule
    })
    const wrapper = await mountPage(PayPOPage, { localVue, store })
    const mockTo = {
      path: '/'
    }
    const mockFrom = {
      path: '/pay-po'
    }
    const stubNext = sinon.stub()

    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
    }
    await wrapper.vm.$nextTick()

    const bankingOnlinePayNow = wrapper.findComponent(BankingOnlinePayNow)
    const shouldNavigate = false
    const stubbedRouterGuard = sinon.stub(bankingOnlinePayNow.vm, 'triggerRouterGuard').resolves(shouldNavigate)

    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
    await beforeRouteLeave.call(wrapper.vm, mockTo, mockFrom, stubNext)

    assert.isTrue(stubbedRouterGuard.calledOnce)
    assert.isTrue(stubNext.calledOnce)
    assert.equal(stubNext.args[0][0], shouldNavigate)
  })

  it('should create newPayment when clicking new payment button', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    sinon.stub(TransactionStatusListener, 'removeLifeCycleListeners')
    sinon.stub(TransactionStatusListener, 'close')
    const getPaymentGatewayMethodStub = sinon.stub().returns(PAYMENT_GATEWAY_METHOD.QR_CODE)
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: getPaymentGatewayMethodStub
      }
    })
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule,
      applicationModule
    })
    const wrapper = await mountPage(PayPOPage, { localVue, store })

    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
    }
    await wrapper.vm.$nextTick()

    const paymentGateway = wrapper.findComponent(PaymentGateway)
    paymentGateway.vm.$emit('newPayment')
    await wrapper.vm.$nextTick()

    assert.isFalse(paymentGateway.exists())
  })
})
