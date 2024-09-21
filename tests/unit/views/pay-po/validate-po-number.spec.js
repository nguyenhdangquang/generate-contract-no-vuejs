import sinon from 'sinon'
import { assert } from 'chai'
import PayPOPage from '@/views/pay-po/Index.vue'
import EpPOPaymentRow from '@/components/molecules/EpPOPaymentRow'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockSettingsModule, createStore } from '../../store-utils'
import * as poNumberValidator from '@/views/pay-po/services/validatePoNumber'
import { PO_NUMBER_ERRORS } from '@/views/pay-po/utils/errors'
import { PO_PAY_STATUS } from '@/views/pay-po/utils/consts'
import * as PurchaseOrder from '@/repositories/PurchaseOrders'
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

describe('<PayPO />: Validate poNumber', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })
  it('should validate poNumber when blur', async () => {
    const mockValidatePoNumber = sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    const updatingRow = rows.at(2)

    updatingRow.vm.$emit('update:poNumber', 'VN123912839821')
    await wrapper.vm.$nextTick()

    updatingRow.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    assert.isTrue(mockValidatePoNumber.calledOnce)
    assert.deepEqual(rows.at(2).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
  })

  it('render error from validation', async () => {
    const error = PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG')
    sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(error)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    await wrapper.vm.$nextTick()
    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123'
    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()
    assert.equal(rows.at(0).props('poItem').error, error)
  })

  it('should validate for duplicated poNumbers', async () => {
    sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(null)
    sinon.stub(PurchaseOrder, 'getOne')
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[3].poNumber = 'VNasdfkjl'
    wrapper.vm.$data.poPaymentList[1].poNumber = 'SG123123123'

    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    assert.deepEqual(rows.at(0).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))
    assert.deepEqual(rows.at(1).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))
    assert.equal(rows.at(3).props('poItem').error, null)
  })

  it('should clear duplicated error on blur', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(PurchaseOrder, 'getOne')
    sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(null)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[3].poNumber = 'SG123123123'

    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    assert.deepEqual(rows.at(0).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))
    assert.deepEqual(rows.at(3).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))

    wrapper.vm.$data.poPaymentList[0].poNumber = 'VN777777'
    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    assert.equal(rows.at(0).props('poItem').error, null)
    assert.equal(rows.at(3).props('poItem').error, null)
  })

  it('should only validate for duplicated poNumber if passed other validations', async () => {
    sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
    sinon.stub(PurchaseOrder, 'getOne')
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123'
    wrapper.vm.$data.poPaymentList[3].poNumber = 'SG123'

    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    assert.deepEqual(rows.at(0).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
    assert.equal(rows.at(3).props('poItem').error, null)
  })

  it('should re-validate duplicated poNumber when removing po rows', async () => {
    sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(null)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)

    wrapper.vm.$data.poPaymentList[0].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[1].poNumber = 'SG123123123'
    wrapper.vm.$data.poPaymentList[3].poNumber = 'SG123123123'
    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    assert.deepEqual(rows.at(0).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))
    assert.deepEqual(rows.at(1).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))
    assert.deepEqual(rows.at(3).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))

    rows.at(3).vm.$emit('remove')
    await wrapper.vm.$nextTick()

    assert.deepEqual(rows.at(0).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))
    assert.deepEqual(rows.at(1).props('poItem').error, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG'))
  })

  it('should fetch po information when removing po', async () => {
    sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(null)
    const stubGetOne = sinon.stub(PurchaseOrder, 'getOne')
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    let rows = wrapper.findAllComponents(EpPOPaymentRow)

    const stubPoInfor = {
      amount: 12200,
      companyName: 'Company A',
      records: 43,
      poUid: '123123213'
    }
    stubGetOne.callsFake(() => stubPoInfor)

    rows.at(0).vm.$emit('update:poNumber', 'SG12312312312')
    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    rows.at(1).vm.$emit('update:poNumber', 'SG12312312312')
    rows.at(1).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    rows.at(0).vm.$emit('remove')
    await wrapper.vm.$nextTick()

    rows = wrapper.findAllComponents(EpPOPaymentRow)
    assert.equal(rows.at(0).props('poItem').records, stubPoInfor.record)
    assert.equal(rows.at(0).props('poItem').companyName, stubPoInfor.companyName)
  })

  it('should show po paid error', async () => {
    sinon.stub(poNumberValidator, 'validatePoNumber').returns(null)
    const mockPoInformation = {
      poUid: 'SG2011231233',
      poAmount: 120000,
      companyName: 'Company A',
      totalBlInv: 5,
      payStatus: PO_PAY_STATUS.YES
    }
    const stubGetOne = sinon.stub(PurchaseOrder, 'getOne').resolves(mockPoInformation)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)

    rows.at(0).vm.$emit('update:poNumber', 'SG2011231233')
    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    assert.isTrue(stubGetOne.calledOnce)
    assert.deepEqual(wrapper.vm.$data.poPaymentList[0].error, PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', 'SG'))
  })
})
