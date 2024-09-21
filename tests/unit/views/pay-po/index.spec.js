import sinon from 'sinon'
import { assert } from 'chai'
import PayPOPage from '@/views/pay-po/Index.vue'
import EpPageTitle from '@/components/atoms/EpPageTitle'
import EpPOPaymentHeader from '@/components/molecules/EpPOPaymentHeader'
import FloatingError from '@/components/FloatingError.vue'
import Layout from '@/components/Layout.vue'
import PaymentGateway from '@/views/payment-gateway/Index.vue'

import EpButton from '@/components/EpButton'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockApplicationModule, createMockPurchaseOrderModule, createMockSettingsModule, createStore } from '../../store-utils'
import { PO_NUMBER_ERRORS } from '@/views/pay-po/utils/errors'
import StorageHelper from '@/utils/storageHelper'
import DialogConfirmNavigation from '@/components/dialog/DialogConfirmNavigation.vue'
import { PAYMENT_GATEWAY_METHOD } from '@/utils/constants'
import * as paymentTransactions from '@/repositories/PaymentTransactions'

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

describe('<PayPO />: General', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should render <EpPageTitle />', async () => {
    window.scrollTo = () => {}
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    assert.isTrue(wrapper.findComponent(EpPageTitle).isVisible())
    assert.equal(wrapper.findComponent(EpPageTitle).text(), 'Pay PO')
  })

  it('should render <EpPOPaymentHeader />', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    const header = wrapper.findComponent(EpPOPaymentHeader)
    assert.isTrue(header.isVisible())
  })

  it('should render Proceed to pay button', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = wrapper.findComponent(EpButton)

    assert.isTrue(ptpb.isVisible())
    assert.equal(ptpb.text(), 'Proceed to Pay')
  })

  it('should trigger get settings action', async () => {
    const stubGetSettings = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: null
        }),
        actions: {
          getSettings: stubGetSettings
        }
      })
    })
    await shallowMountPage(PayPOPage, { localVue, store })

    assert.isTrue(stubGetSettings.calledOnce)
  })

  it('should not get settings when settings already in store', async () => {
    const stubGetSettings = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        }),
        actions: {
          getSettings: stubGetSettings
        }
      })
    })
    await shallowMountPage(PayPOPage, {
      localVue,
      store,
      propsData: {
        countryCode: 'sg'
      }
    })

    sinon.assert.notCalled(stubGetSettings)
  })

  it('should get empty currencyCode when settings not found', async () => {
    const mockSettingsModule = createMockSettingsModule({
      state: () => ({
        settings: {}
      })
    })
    const store = createStore({
      settingsModule: mockSettingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    await wrapper.vm.$nextTick()

    assert.equal(wrapper.vm.currencyCode, '')
    assert.equal(wrapper.vm.totalAmount, 0)
  })

  it('should get currencyCode from settings', async () => {
    const mockSettingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule: mockSettingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    await wrapper.vm.$nextTick()

    assert.equal(
      wrapper.vm.currencyCode,
      mockSettingsModule.getters.country(mockSettingsModule.state()).defaultCurrency.code
    )
    assert.deepEqual(
      wrapper.vm.country,
      mockSettingsModule.getters.country(mockSettingsModule.state())
    )
  })

  it('should dispatch action clearGlobalError when leaving route', async () => {
    const applicationclearErrorStub = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      }),
      applicationModule: createMockApplicationModule({
        actions: {
          clearError: applicationclearErrorStub
        }
      })
    })

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
    const nextFun = sinon.stub()

    beforeRouteLeave.call(wrapper.vm, { path: '/' }, { path: '/create-po' }, nextFun)
    assert.isTrue(applicationclearErrorStub.calledOnce)
    assert.isTrue(nextFun.calledOnce)
  })

  it('should dispatch action clearGlobalError when leaving route - but did not come to payment gateway', async () => {
    const applicationclearErrorStub = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      }),
      applicationModule: createMockApplicationModule({
        actions: {
          clearError: applicationclearErrorStub
        }
      })
    })

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    wrapper.vm.$data.allowNavigation = true
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
    const nextFun = sinon.stub()

    beforeRouteLeave.call(wrapper.vm, { path: '/' }, { path: '/create-po' }, nextFun)
    assert.isTrue(applicationclearErrorStub.calledOnce)
    assert.isTrue(nextFun.calledOnce)
    assert.equal(wrapper.vm.$data.isOpenModalNavigation, false)
  })

  it('should dispatch action clearGlobalError when leaving route - click confirm on popup navigation', async () => {
    const applicationclearErrorStub = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      }),
      applicationModule: createMockApplicationModule({
        actions: {
          clearError: applicationclearErrorStub
        }
      })
    })

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    wrapper.vm.$data.hasChangedData = true
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
    const nextFun = sinon.stub()

    beforeRouteLeave.call(wrapper.vm, { path: '/' }, { path: '/create-po' }, nextFun)

    const dialogConfirmNavigation = wrapper.findComponent(DialogConfirmNavigation)
    dialogConfirmNavigation.vm.$emit('confirm')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    assert.isTrue(applicationclearErrorStub.calledOnce)
    assert.isTrue(nextFun.calledOnce)
    assert.equal(wrapper.vm.$data.isOpenModalNavigation, false)
  })

  it('should dispatch action clearGlobalError when leaving route - click discard on popup navigation', async () => {
    const applicationclearErrorStub = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      }),
      applicationModule: createMockApplicationModule({
        actions: {
          clearError: applicationclearErrorStub
        }
      })
    })

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    wrapper.vm.$data.hasChangedData = true
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
    const nextFun = sinon.stub()

    beforeRouteLeave.call(wrapper.vm, { path: '/' }, { path: '/create-po' }, nextFun)

    const dialogConfirmNavigation = wrapper.findComponent(DialogConfirmNavigation)
    dialogConfirmNavigation.vm.$emit('discard')

    assert.isTrue(applicationclearErrorStub.notCalled)
    assert.isTrue(nextFun.notCalled)
    assert.equal(wrapper.vm.$data.isOpenModalNavigation, false)
  })

  it('should clear createdPO when leaving route', async () => {
    const stubSetCreatePO = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      }),
      purchaseOrderModule: createMockPurchaseOrderModule({
        actions: {
          setCreatedPO: stubSetCreatePO
        }
      })
    })

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]

    beforeRouteLeave.call(wrapper.vm, { path: '/' }, { path: '/create-po' }, sinon.stub())
    assert.isTrue(stubSetCreatePO.calledOnce)
  })

  it('should remove event beforeunload before component destroyed', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const mockRemoveEvent = sinon.stub(window, 'removeEventListener')
    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    wrapper.vm.$destroy()

    assert.isTrue(mockRemoveEvent.calledOnce)
    assert.equal(mockRemoveEvent.args[0][0], 'beforeunload')
  })

  it('should change isChangingFlag value to true when user confirm to change flag', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    const layoutComponent = wrapper.findComponent(Layout)
    layoutComponent.vm.$emit('confirmChangeFlag')

    assert.isTrue(wrapper.vm.isChangingFlag)
  })

  it('should not handle before unload if current page is payment gateway', async () => {
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub().returns(PAYMENT_GATEWAY_METHOD.QR_CODE)
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

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })

    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22
    }

    await wrapper.vm.$nextTick()

    const event = {
      preventDefault: () => { return true },
      returnValue: '1234'
    }
    const spy = sinon.spy(event, 'preventDefault')

    window.dispatchEvent(new Event('beforeunload'))

    sinon.assert.notCalled(spy)
    assert.equal(event.returnValue, '1234')
  })

  it('should get new payment transaction when call retry function', async () => {
    window.scrollTo = () => {}
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub().returns(PAYMENT_GATEWAY_METHOD.QR_CODE)
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

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    const newPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22,
      qrCode: 'newQrCode'
    }
    sinon.stub(paymentTransactions, 'retry').resolves(newPaymentTransaction)
    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22,
      qrCode: 'qrCode'
    }

    await wrapper.vm.$nextTick()
    const paymentGateway = wrapper.findComponent(PaymentGateway)
    paymentGateway.vm.$emit('retry', '123123123')
    await wrapper.vm.$nextTick()
    assert.deepEqual(wrapper.vm.$data.createdPaymentTransaction, newPaymentTransaction)
  })

  it('should get error when call retry function failed', async () => {
    window.scrollTo = () => {}
    const applicationModule = createMockApplicationModule({
      getters: {
        getPaymentGatewayMethod: sinon.stub().returns(PAYMENT_GATEWAY_METHOD.QR_CODE)
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

    const wrapper = await shallowMountPage(PayPOPage, { store, localVue })
    sinon.stub(paymentTransactions, 'retry').rejects({
      title: 'Something went wrong',
      message: 'Could not complete the operation due to network problem'
    })
    wrapper.vm.$data.createdPaymentTransaction = {
      transactionUid: '123123123',
      currency: 'SGD',
      totalLocalAmount: 12000.22,
      qrCode: 'qrCode'
    }
    await wrapper.vm.$nextTick()
    const paymentGateway = wrapper.findComponent(PaymentGateway)
    paymentGateway.vm.$emit('retry', '123123123')
    await wrapper.vm.$nextTick()

    assert.isNotNull(store.state.application.error)
    assert.equal(store.state.application.error.title, 'Something went wrong')
    assert.equal(store.state.application.error.message, 'Could not complete the operation due to network problem')
  })

  describe('Floating Error', () => {
    it('should render Floating Error Component', async () => {
      const mockSettingsModule = createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
      const store = createStore({
        settingsModule: mockSettingsModule
      })
      const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

      wrapper.vm.$data.poPaymentList[0].error = PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG')
      wrapper.vm.$data.poPaymentList[1].error = PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG')

      await wrapper.vm.$nextTick()
      const floatingErrors = wrapper.findComponent(FloatingError)

      assert.isTrue(floatingErrors.isVisible())
      assert.equal(floatingErrors.props('floatingErrors').length, 2)
    })

    it('should clear floating errors when removing rows', async () => {
      const mockSettingsModule = createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
      const store = createStore({
        settingsModule: mockSettingsModule
      })
      const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

      wrapper.vm.$data.poPaymentList[0].error = PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG')
      wrapper.vm.$data.poPaymentList[1].error = PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG')
      await wrapper.vm.$nextTick()

      const floatingErrors = wrapper.findComponent(FloatingError)

      wrapper.vm.$data.poPaymentList = [
        ...wrapper.vm.$data.poPaymentList.slice(0, 1),
        ...wrapper.vm.$data.poPaymentList.slice(2)
      ]
      await wrapper.vm.$nextTick()

      assert.equal(floatingErrors.props('floatingErrors').length, 1)
    })
  })
})
