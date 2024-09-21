import sinon from 'sinon'
import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import TotalAmount from '@/components/TotalAmount.vue'
import { createAppLocalVue } from '../utils'
import { createMockSettingsModule, createStore } from '../store-utils'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import { getTextByCountry } from '@/utils/displayTextResources'

const localVue = createAppLocalVue()
const baseSettings = {
  country: {
    code: 'SG',
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

describe('<TotalAmount />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render total amount and message texts', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(
      TotalAmount,
      {
        store,
        localVue,
        propsData: {
          errorFn: ErrorMessage.BL_AMOUNT_EXCEED_MAX,
          totalAmount: 0
        }
      }
    )

    assert.equal(wrapper.find('[data-testid="total-amount-text"]').text(), 'Total Amount: SGD 0.00')
    assert.equal(wrapper.find('[data-testid="total-amount-note-text"]').text(), '(The total amount must not exceed SGD 200,000.00)')
  })

  it('should render total amount from props', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(
      TotalAmount,
      {
        store,
        localVue,
        propsData: {
          errorFn: ErrorMessage.BL_AMOUNT_EXCEED_MAX,
          totalAmount: 12500
        }
      }
    )

    assert.equal(wrapper.find('[data-testid="total-amount-text"]').text(), 'Total Amount: SGD 12,500.00')
  })

  it('should return default values if settings failed to get', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: null
        })
      })
    })
    const wrapper = shallowMount(
      TotalAmount,
      {
        store,
        localVue,
        propsData: {
          errorFn: ErrorMessage.BL_AMOUNT_EXCEED_MAX,
          totalAmount: 0
        }
      }
    )

    assert.equal(wrapper.vm.maxTotalAmount, 0)
    assert.equal(wrapper.vm.currencyCode, '')
    assert.equal(wrapper.vm.formattedTotalAmount, '')
    assert.equal(wrapper.vm.formattedMaxTotalAmount, '')
    assert.equal(wrapper.vm.formattedExceedAmount, '')
  })

  it('should display error when total amount exceed max total amount', () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(
      TotalAmount,
      {
        store,
        localVue,
        propsData: {
          errorFn: (max, exceed, currency) => getTextByCountry('SG', 'createPOpage_maxAmount_uploadFile_errorMsg_reachedMax', [max, exceed, currency]),
          totalAmount: 250000
        }
      }
    )
    assert.equal(
      wrapper.find('[data-testid="total-amount-error"]').text(),
      getTextByCountry('SG', 'createPOpage_maxAmount_uploadFile_errorMsg_reachedMax', ['200,000.00', '50,000.00', 'SGD'])
    )
    assert.isFalse(wrapper.find('[data-testid="total-amount-note-text"]').exists())
  })

  it('should display error when total PO amount exceed max total amount', () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(
      TotalAmount,
      {
        store,
        localVue,
        propsData: {
          errorFn: (max, exceed, currency) => getTextByCountry('SG', 'payPOPage_totalAmount_label_errorMsg_exceedMax', [currency, max]),
          totalAmount: 250000
        }
      }
    )

    assert.equal(
      wrapper.find('[data-testid="total-amount-error"]').text(),
      getTextByCountry('SG', 'payPOPage_totalAmount_label_errorMsg_exceedMax', ['SGD', '200,000.00'])
    )
    assert.isFalse(wrapper.find('[data-testid="total-amount-note-text"]').exists())
  })
})
