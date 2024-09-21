import sinon from 'sinon'
import { assert } from 'chai'
import PayPOPage from '@/views/pay-po/Index.vue'
import * as PurchaseOrder from '@/repositories/PurchaseOrders'
import EpPOPaymentRow from '@/components/molecules/EpPOPaymentRow'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockPurchaseOrderModule, createMockSettingsModule, createStore } from '../../store-utils'
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

describe('<PayPO />: <EpPOPaymentRowManagement />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should render <EpPOPaymentRow />', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    assert.isTrue(wrapper.findAllComponents(EpPOPaymentRow).isVisible())
  })

  it('should render 5 <EpPOPaymentRow />', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    assert.equal(wrapper.findAllComponents(EpPOPaymentRow).length, 5)
  })

  it('should render with index', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)

    for (let i = 0; i < rows.length; i += 1) {
      assert.equal(rows.at(i).props('index'), i)
    }
  })

  it('should render currency from settings', async () => {
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

    for (let i = 0; i < rows.length; i += 1) {
      assert.equal(
        rows.at(i).props('poItem').currency,
        settingsModule.getters.country(settingsModule.state()).defaultCurrency.code
      )
    }
  })

  it('should render createdPO', async () => {
    const createdPO = {
      poUid: '123123',
      poAmount: 20000,
      companyName: 'Company A',
      totalBlInv: 5
    }
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      }),
      purchaseOrderModule: createMockPurchaseOrderModule({
        state: () => ({
          createdPO
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    await wrapper.vm.$nextTick()

    const poItemProps = wrapper.findAllComponents(EpPOPaymentRow).at(0).props('poItem')
    assert.equal(poItemProps.poNumber, createdPO.poUid)
    assert.equal(poItemProps.amount, '20,000.00')
    assert.equal(poItemProps.companyName, createdPO.companyName)
    assert.equal(poItemProps.records, createdPO.totalBlInv)
  })

  it('should remove row', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    let rows = wrapper.findAllComponents(EpPOPaymentRow)

    const deletingRow = rows.at(3)
    deletingRow.vm.$emit('remove')
    await wrapper.vm.$nextTick()

    rows = wrapper.findAllComponents(EpPOPaymentRow)
    assert.equal(rows.length, 4)

    for (let i = 0; i < rows.length; i += 1) {
      assert.equal(rows.at(i).props('index'), i)
    }
    assert.equal(wrapper.vm.$data.hasChangedData, true)
  })

  it('should update poNumber', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    const updatingRow = rows.at(2)

    updatingRow.vm.$emit('update:poNumber', 'VN123912839821')
    await wrapper.vm.$nextTick()

    assert.equal(updatingRow.props('poItem').poNumber, 'VN123912839821')
  })

  it('should call to get PO information', async () => {
    const poNumber = 'SG123123123'
    const stubGetOnePO = sinon.stub(PurchaseOrder, 'getOne')
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

    wrapper.vm.$data.poPaymentList[0].poNumber = poNumber
    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()

    assert.isTrue(stubGetOnePO.calledOnce)
    assert.deepEqual(stubGetOnePO.args[0], [poNumber, {
      countryCode: settingsModule.getters.country(settingsModule.state()).code
    }])
    assert.equal(wrapper.vm.$data.hasChangedData, true)
  })

  it('should fill data from getOne PO API to row', async () => {
    const poNumber = 'SG123123123'
    const mockPoInformation = {
      poUid: 'SG123123123',
      poAmount: 120000,
      companyName: 'Company A',
      totalBlInv: 5
    }
    sinon.stub(PurchaseOrder, 'getOne').resolves(mockPoInformation)
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

    wrapper.vm.$data.poPaymentList[0].poNumber = poNumber
    rows.at(0).vm.$emit('blur')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const poItemProps = rows.at(0).props('poItem')
    assert.equal(poItemProps.companyName, mockPoInformation.companyName)
    assert.equal(poItemProps.records, mockPoInformation.totalBlInv)
  })
})
