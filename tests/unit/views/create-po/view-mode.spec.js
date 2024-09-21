import { assert } from 'chai'
import sinon from 'sinon'
import StorageHelper from '@/utils/storageHelper'
import CreatePOPage from '@/views/create-po/Index.vue'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockSettingsModule, createStore } from '../../store-utils'

const localVue = createAppLocalVue()
const baseSettings = {
  country: {
    code: 'SG',
    areaCode: '+65',
    defaultCurrency: {
      code: 'SGD',
      name: 'Singapore Dollar',
      fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
      decimalPlaces: '2',
      thousandSeparator: ',',
      bankMaxAmount: 200000
    }
  }
}

describe('<CreatePo />: View mode', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  describe('Proceed to pay button', () => {
    it('should not render proceed to pay button initially', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })

      const proceedToPayButton = wrapper.find('[data-testid="proceed-to-pay-button"]')

      assert.isFalse(proceedToPayButton.exists())
    })

    it('should render proceed to pay button in view mode', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      wrapper.vm.$data.readonlyMode = true
      await wrapper.vm.$nextTick()

      const proceedToPayButton = wrapper.find('[data-testid="proceed-to-pay-button"]')

      assert.isTrue(proceedToPayButton.isVisible())
      assert.deepEqual(proceedToPayButton.text(), 'Proceed to Pay')
    })

    it('should navigate to pay po page directly when clicking proceed to pay button', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      wrapper.vm.$data.readonlyMode = true
      await wrapper.vm.$nextTick()

      const proceedToPayButton = wrapper.find('[data-testid="proceed-to-pay-button"]')
      proceedToPayButton.vm.$emit('click')
      await wrapper.vm.$nextTick()
      assert.equal(wrapper.vm.$router.currentRoute.path, '/sg/pay-po')
    })
  })
})
