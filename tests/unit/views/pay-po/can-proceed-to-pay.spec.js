import sinon from 'sinon'
import { assert } from 'chai'
import PayPOPage from '@/views/pay-po/Index.vue'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockPurchaseOrderModule, createMockSettingsModule, createStore } from '../../store-utils'
import { PO_NUMBER_ERRORS } from '@/views/pay-po/utils/errors'
import * as poNumberValidator from '@/views/pay-po/services/validatePoNumber'
import StorageHelper from '@/utils/storageHelper'

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

function findPTPB (wrapper) {
  return wrapper.find('[data-testid="proceed-to-pay-button"]')
}

describe('<PayPO />: Can proceed to pay button', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should render disabled PTPB initially', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    assert.isTrue(ptpb.isVisible())
    assert.equal(ptpb.attributes('disabled'), 'true')
  })

  it('should enable PTPB when filled with createdPO', async () => {
    sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(null)
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      }),
      purchaseOrderModule: createMockPurchaseOrderModule({
        state: () => ({
          createdPO: {
            poUid: 'SG1920765894',
            poAmount: 12000.55,
            companyName: 'Company A',
            totalBlInv: 10
          }
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    assert.isTrue(ptpb.isVisible())
    assert.equal(ptpb.attributes('disabled'), undefined)
  })

  it('should enable PTPB when valid data is filled', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), 'true')

    wrapper.vm.$data.poPaymentList[0].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[0].records = 5
    wrapper.vm.$data.poPaymentList[0].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)
  })

  it('should disable PTPB when having invalid pos', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[0].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[0].records = 5
    wrapper.vm.$data.poPaymentList[0].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)

    wrapper.vm.$data.poPaymentList[0].error = PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG')
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), 'true')
  })

  it('should disable PTPB when exceeding max bank amount', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[0].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[0].records = 5
    wrapper.vm.$data.poPaymentList[0].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)

    wrapper.vm.$data.poPaymentList[1].poNumber = 'SG1212876578'
    wrapper.vm.$data.poPaymentList[1].amount = '220,000.00'
    wrapper.vm.$data.poPaymentList[1].records = 2
    wrapper.vm.$data.poPaymentList[1].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), 'true')
  })

  it('should disable PTPB when exceeding max pos', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    wrapper.vm.MAX_POS = 6

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[0].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[0].records = 5
    wrapper.vm.$data.poPaymentList[0].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)

    Array.from({ length: 7 }, (_v, i) => {
      if (!wrapper.vm.$data.poPaymentList[i]) {
        wrapper.vm.$data.poPaymentList.push({})
      }
      wrapper.vm.$data.poPaymentList[i].poNumber = `SG12312312${i}`
      wrapper.vm.$data.poPaymentList[i].amount = '1,000.00'
      wrapper.vm.$data.poPaymentList[i].records = 2
      wrapper.vm.$data.poPaymentList[i].companyName = 'Company A'
    })
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), 'true')
  })

  it('should enable PTPB when reaching max pos', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    wrapper.vm.MAX_POS = 6

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[0].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[0].records = 5
    wrapper.vm.$data.poPaymentList[0].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)

    Array.from({ length: 6 }, (_v, i) => {
      if (!wrapper.vm.$data.poPaymentList[i]) {
        wrapper.vm.$data.poPaymentList.push({})
      }
      wrapper.vm.$data.poPaymentList[i].poNumber = `SG12312312${i}`
      wrapper.vm.$data.poPaymentList[i].amount = '1,000.00'
      wrapper.vm.$data.poPaymentList[i].records = 2
      wrapper.vm.$data.poPaymentList[i].companyName = 'Company A'
    })
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)
  })

  it('should disable PTPB when exceeding max bls', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    wrapper.vm.MAX_BLS = 10

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[0].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[0].records = 5
    wrapper.vm.$data.poPaymentList[0].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)

    wrapper.vm.$data.poPaymentList[1].poNumber = 'SG123123124'
    wrapper.vm.$data.poPaymentList[1].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[1].records = 6
    wrapper.vm.$data.poPaymentList[1].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), 'true')
  })

  it('should disable PTPB when reaching max bls', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const ptpb = findPTPB(wrapper)

    wrapper.vm.MAX_BLS = 10

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[0].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[0].records = 5
    wrapper.vm.$data.poPaymentList[0].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)

    wrapper.vm.$data.poPaymentList[1].poNumber = 'SG123123124'
    wrapper.vm.$data.poPaymentList[1].amount = '20,000.00'
    wrapper.vm.$data.poPaymentList[1].records = 5
    wrapper.vm.$data.poPaymentList[1].companyName = 'Company A'
    await wrapper.vm.$nextTick()

    assert.equal(ptpb.attributes('disabled'), undefined)
  })
})
