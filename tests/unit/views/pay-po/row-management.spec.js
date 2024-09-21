import sinon from 'sinon'
import { assert } from 'chai'
import PayPOPage from '@/views/pay-po/Index.vue'
import EpPOPaymentRowManagement from '@/components/molecules/EpPOPaymentRowManagement'
import EpPOPaymentRow from '@/components/molecules/EpPOPaymentRow'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockSettingsModule, createStore } from '../../store-utils'
import StorageHelper from '@/utils/storageHelper'
import { MAX_RECORDS_BL } from '../../../../src/utils/constants'

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

  it('should render <EpPOPaymentRowManagement />', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    assert.isTrue(wrapper.findComponent(EpPOPaymentRowManagement).isVisible())
  })

  it('should render limit records', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })

    assert.equal(wrapper.findComponent(EpPOPaymentRowManagement).props('maxBls'), MAX_RECORDS_BL)
  })

  it('should add new po row', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rowManagement = wrapper.findComponent(EpPOPaymentRowManagement)

    rowManagement.vm.$emit('add')
    await wrapper.vm.$nextTick()

    assert.equal(wrapper.findAllComponents(EpPOPaymentRow).length, 6)
    assert.equal(wrapper.vm.$data.hasChangedData, true)
  })

  it('should render total bls', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rowManagement = wrapper.findComponent(EpPOPaymentRowManagement)

    wrapper.vm.$data.poPaymentList[0].records = 4
    wrapper.vm.$data.poPaymentList[1].records = 2
    wrapper.vm.$data.poPaymentList[3].records = 5
    await wrapper.vm.$nextTick()

    assert.equal(rowManagement.props('blsCount'), 11)
  })
})
