import { assert } from 'chai'
import sinon from 'sinon'
import BankingOnlinePayNow from '@/views/payment-gateway/components/BankingOnlinePayNow.vue'
import EpLabel from '@/components/atoms/EpLabel'
import EpPageTitle from '@/components/atoms/EpPageTitle'
import EpButton from '@/components/EpButton.vue'
import Layout from '@/components/Layout.vue'
import { createAppLocalVue, shallowMountPage } from '../../../utils'
import DialogConfirmNavigation from '@/components/dialog/DialogConfirmNavigation.vue'
import { createMockApplicationModule, createMockSettingsModule, createStore } from '../../../store-utils'
import { PAYMENT_GATEWAY_METHOD } from '@/utils/constants'

const localVue = createAppLocalVue()
const sleep = (time) => {
  return new Promise(resolve => setTimeout(resolve, time))
}

const baseSettings = {
  country: {
    code: 'SG',
    defaultCurrency: {
      code: 'SGD',
      decimalPlaces: '2',
      thousandSeparator: ',',
      bankMaxAmount: 200000
    }
  },
  defaultUEN: 'defaultUEN'
}

describe('payment-gateway: online-banking-paynow.spec', () => {
  beforeEach(() => {
    sinon.stub(window, 'scrollTo')
    document.execCommand = sinon.stub()
  })
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render static element and data render', async () => {
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
    const propsData = {
      currencyCode: 'SGD',
      transactionUid: '2131231231',
      totalAmount: '123'
    }

    const formattedTotalAmount = propsData.totalAmount + '.00'

    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue, propsData })
    const uenElement = wrapper.find('[data-testid="uen"]')
    const transactionUidElement = wrapper.find('[data-testid="transactionUid"]')
    const totalAmountElement = wrapper.find('[data-testid="totalAmount"]')

    assert.isTrue(wrapper.findComponent(Layout).isVisible())
    assert.isTrue(wrapper.findComponent(EpLabel).isVisible())
    assert.isTrue(wrapper.findComponent(EpPageTitle).isVisible())
    assert.equal(wrapper.findAllComponents(EpButton).length, 5)
    assert.equal(uenElement.text(), 'defaultUEN')
    assert.equal(transactionUidElement.text(), propsData.transactionUid)

    assert.equal(totalAmountElement.text(), propsData.currencyCode + ' ' + formattedTotalAmount)
  })

  it('should return 0 in formattedTotalAmount func if settings failed to get', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: null
        })
      })
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue })
    assert.equal(wrapper.vm.formattedTotalAmount, '0')
  })

  it('render navigate popup by New Payment button', async () => {
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub()
      }
    })

    const store = createStore({
      applicationModule
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue })
    const newPaymentButton = wrapper.find('.new-payment-button')
    newPaymentButton.vm.$emit('click')
    await wrapper.vm.$nextTick()
    assert.isTrue(wrapper.findComponent(DialogConfirmNavigation).exists())
  })

  it('render navigate popup by Home Page button', async () => {
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub()
      }
    })

    const store = createStore({
      applicationModule
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue })
    const homePageButton = wrapper.find('.home-page-button')
    homePageButton.vm.$emit('click')
    assert.isTrue(wrapper.findComponent(DialogConfirmNavigation).exists())
  })

  it('Discard button functional', async () => {
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub()
      }
    })

    const store = createStore({
      applicationModule
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue })
    const newPaymentButton = wrapper.find('.new-payment-button')
    newPaymentButton.vm.$emit('click')
    await wrapper.vm.$nextTick()
    const confirmDialog = wrapper.findComponent(DialogConfirmNavigation)
    confirmDialog.vm.$emit('discard')
    await wrapper.vm.$nextTick()
    assert.equal(wrapper.vm.$data.isOpenModalNavigation, false)
  })

  it('Confirm button functional redirect to PayPO page', async () => {
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub()
      }
    })
    const store = createStore({
      applicationModule
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue })
    const newPaymentButton = wrapper.find('.new-payment-button')
    newPaymentButton.vm.$emit('click')
    await wrapper.vm.$nextTick()
    const confirmDialog = wrapper.findComponent(DialogConfirmNavigation)
    confirmDialog.vm.$emit('confirm')
    await wrapper.vm.$nextTick()
    assert.equal(confirmDialog.emitted('confirm').length, 1)
  })

  it('Confirm button functional redirect to Home page', async () => {
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub()
      }
    })
    const store = createStore({
      applicationModule
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue })
    const newPaymentButton = wrapper.find('.home-page-button')
    newPaymentButton.vm.$emit('click')
    await wrapper.vm.$nextTick()
    const confirmDialog = wrapper.findComponent(DialogConfirmNavigation)
    confirmDialog.vm.$emit('confirm')
    await wrapper.vm.$nextTick()
    assert.equal(confirmDialog.emitted('confirm').length, 1)
  })

  it('should render changing country popup', async () => {
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
    const propsData = {
      uen: 'uen1223',
      transactionUid: '2131231231',
      totalAmount: 'SGD 123,123.66',
      country: {
        code: 'SG'
      }
    }
    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue, propsData })
    const componentLayout = wrapper.findComponent(Layout)
    componentLayout.vm.$emit('confirmChangeFlag')

    assert.isTrue(wrapper.vm.$data.isChangingFlag)
  })

  it('should render browser popup', async () => {
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
    const propsData = {
      uen: 'uen1223',
      transactionUid: '2131231231',
      totalAmount: 'SGD 123,123.66',
      country: {
        code: 'SG'
      }
    }
    const event = {
      preventDefault: () => {
        return null
      },
      returnValue: '12313123'
    }
    const spy = sinon.spy(event, 'preventDefault')
    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue, propsData })
    wrapper.vm.handleBeforeUnload(event)

    sinon.assert.calledOnce(spy)
    assert.equal(event.returnValue, '')
  })

  it('should remove event beforeDestroy', async () => {
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
    const mockRemoveEvent = sinon.stub(window, 'removeEventListener')
    const wrapper = await shallowMountPage(BankingOnlinePayNow, {
      store,
      localVue,
      propsData: {
        uen: 'uen1223',
        transactionUid: '2131231231',
        totalAmount: 'SGD 123,123.66',
        country: {
          code: 'SG'
        }
      }
    })

    wrapper.vm.$destroy()
    assert.isTrue(mockRemoveEvent.calledOnce)
    assert.equal(mockRemoveEvent.args[0][0], 'beforeunload')
  })

  it('should allow navigation when click buttons of page', async () => {
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
    const propsData = {
      currencyCode: 'SGD',
      transactionUid: '2131231231',
      totalAmount: '123'
    }

    const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue, propsData })
    wrapper.vm.$data.isClickingButtonOnPage = true
    assert.isTrue(await wrapper.vm.triggerRouterGuard())
  })

  it('should copy UEN number if click copy UEN button', async () => {
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub()
      }
    })
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      applicationModule,
      settingsModule
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, {
      store,
      localVue,
      propsData: {
        transactionUid: 'transactionUid',
        totalAmount: 5,
        currencyCode: 'SGD'
      }
    })
    const button = wrapper.find('[data-testid="copy-uen-button"]')
    button.vm.$emit('click')
    setTimeout(function () {
      assert.isFalse(wrapper.vm.$data.copiedUEN)
    }, 2500)
    assert.equal(wrapper.vm.$data.copiedData, 'defaultUEN')
  })

  it('should copy transaction uid if click copy transaction uid button', async () => {
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub()
      }
    })
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      applicationModule,
      settingsModule
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, {
      store,
      localVue,
      propsData: {
        transactionUid: 'transactionUid',
        totalAmount: 5,
        currencyCode: 'SGD'
      }
    })
    const button = wrapper.find('[data-testid="copy-txn-uid-button"]')
    button.vm.$emit('click')
    setTimeout(function () {
      assert.isFalse(wrapper.vm.$data.copiedTxnUid)
    }, 2500)
    assert.equal(wrapper.vm.$data.copiedData, 'transactionUid')
  })

  it('should copy transaction uid if click copy transaction uid button', async function () {
    this.timeout(3000)
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub()
      }
    })
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      applicationModule,
      settingsModule
    })
    const wrapper = await shallowMountPage(BankingOnlinePayNow, {
      store,
      localVue,
      propsData: {
        transactionUid: 'transactionUid',
        totalAmount: 5,
        currencyCode: 'SGD'
      }
    })
    const button = wrapper.find('[data-testid="copy-total-amt-button"]')
    button.vm.$emit('click')
    await sleep(2500)
    assert.isFalse(wrapper.vm.$data.copiedTotalAmt)
    assert.equal(wrapper.vm.$data.copiedData, 5)
  })

  describe('navigate by clicking on header', () => {
    it('should navigate to another page when click confirm button of navigation popup', async () => {
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
      const propsData = {
        currencyCode: 'SGD',
        transactionUid: '2131231231',
        totalAmount: '123'
      }

      const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue, propsData })
      const spiedTriggerRouterGuard = sinon.spy(wrapper.vm, 'triggerRouterGuard')
      wrapper.vm.triggerRouterGuard()
      await wrapper.vm.$nextTick()

      const dialogComponent = wrapper.findComponent(DialogConfirmNavigation)
      dialogComponent.vm.$emit('confirm')
      await wrapper.vm.$nextTick()

      assert.isTrue(spiedTriggerRouterGuard.calledOnce)
      assert.isTrue(await spiedTriggerRouterGuard.returnValues[0])
      assert.equal(wrapper.vm.$data.isOpenModalNavigation, false)
    })

    it('should stay here when click discard button of navigation popup', async () => {
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
      const propsData = {
        currencyCode: 'SGD',
        transactionUid: '2131231231',
        totalAmount: '123'
      }

      const wrapper = await shallowMountPage(BankingOnlinePayNow, { store, localVue, propsData })
      const spiedTriggerRouterGuard = sinon.spy(wrapper.vm, 'triggerRouterGuard')
      wrapper.vm.triggerRouterGuard()
      await wrapper.vm.$nextTick()

      const dialogComponent = wrapper.findComponent(DialogConfirmNavigation)
      dialogComponent.vm.$emit('discard')
      await wrapper.vm.$nextTick()

      assert.isTrue(spiedTriggerRouterGuard.calledOnce)
      assert.isFalse(await spiedTriggerRouterGuard.returnValues[0])
      assert.equal(wrapper.vm.$data.isOpenModalNavigation, false)
    })
  })
})
