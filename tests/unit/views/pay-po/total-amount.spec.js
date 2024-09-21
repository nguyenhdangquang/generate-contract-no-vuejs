import sinon from 'sinon'
import { assert } from 'chai'
import PayPOPage from '@/views/pay-po/Index.vue'
import TotalAmount from '@/components/TotalAmount'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockSettingsModule, createStore } from '../../store-utils'
import StorageHelper from '@/utils/storageHelper'

const localVue = createAppLocalVue()
const baseSettings = {
  country: {
    defaultCurrency: {
      code: 'SGD',
      decimalPlaces: '2',
      thousandSeparator: ',',
      bankMaxAmount: 200000
    }
  }
}

describe('<PayPO />: <TotalAmount />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should render <TotalAmount />', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const totalAmount = wrapper.findComponent(TotalAmount)

    assert.isTrue(totalAmount.isVisible())
  })

  it('should render total amount 0 initially', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const totalAmount = wrapper.findComponent(TotalAmount)

    assert.equal(totalAmount.props('totalAmount'), 0)
  })

  it('should provide errorFn', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })

    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const totalAmount = wrapper.findComponent(TotalAmount)

    assert.isFunction(totalAmount.props('errorFn'))
  })
})
