import { assert } from 'chai'
import sinon from 'sinon'
import { createAppLocalVue, shallowMountPage, triggerInputChange } from '../../utils'
import {
  findAllBlRows,
  findBlAmountInput,
  removeBlRow
} from './utils'
import { createMockSettingsModule, createStore } from '../../store-utils'
import TotalAmount from '@/components/TotalAmount.vue'
import CreatePOPage from '@/views/create-po/Index.vue'
import StorageHelper from '@/utils/storageHelper'

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

describe('Index.vue: <TotalAmount />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })
  it('should render TotalAmount', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: {
            ...baseSettings,
            country: {
              ...baseSettings.country,
              defaultCurrency: {
                ...baseSettings.country.defaultCurrency,
                bankMaxAmount: 200000
              }
            }
          }
        })
      })
    })
    const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
    const totalAmount = wrapper.findComponent(TotalAmount)

    assert.isTrue(totalAmount.isVisible())
    assert.equal(totalAmount.props('totalAmount'), 0)
  })

  it('should calculate total amount', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: {
            ...baseSettings,
            country: {
              ...baseSettings.country,
              defaultCurrency: {
                ...baseSettings.country.defaultCurrency,
                bankMaxAmount: 200000
              }
            }
          }
        })
      })
    })
    const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
    const totalAmount = wrapper.findComponent(TotalAmount)
    const firstBlRow = findAllBlRows(wrapper).at(0)
    const firstBlAmountInput = findBlAmountInput(firstBlRow)
    triggerInputChange(firstBlAmountInput, '20000')

    await wrapper.vm.$nextTick()

    assert.equal(totalAmount.props('totalAmount'), 20000)
  })

  it('should calculate total amount when adding bl rows', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: {
            ...baseSettings,
            country: {
              ...baseSettings.country,
              defaultCurrency: {
                ...baseSettings.country.defaultCurrency,
                bankMaxAmount: 200000
              }
            }
          }
        })
      })
    })
    const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
    const totalAmount = wrapper.findComponent(TotalAmount)

    const firstBlRow = findAllBlRows(wrapper).at(0)
    const firstBlAmountInput = findBlAmountInput(firstBlRow)
    triggerInputChange(firstBlAmountInput, '20000')

    const addButton = wrapper.find('[data-testid="bl-add-button"]')

    addButton.trigger('click')
    await wrapper.vm.$nextTick()

    const newBlRow = findAllBlRows(wrapper).at(5)
    const newBlRowInput = findBlAmountInput(newBlRow)
    triggerInputChange(newBlRowInput, '12000.44')

    await wrapper.vm.$nextTick()

    assert.equal(totalAmount.props('totalAmount'), 32000.44)
  })

  it('should calculate total amount when adding bl rows', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: {
            ...baseSettings,
            country: {
              ...baseSettings.country,
              defaultCurrency: {
                ...baseSettings.country.defaultCurrency,
                bankMaxAmount: 200000
              }
            }
          }
        })
      })
    })
    const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
    const totalAmount = wrapper.findComponent(TotalAmount)

    const firstBlRow = findAllBlRows(wrapper).at(0)
    const firstBlAmountInput = findBlAmountInput(firstBlRow)
    triggerInputChange(firstBlAmountInput, '20000')

    const addButton = wrapper.find('[data-testid="bl-add-button"]')

    addButton.trigger('click')
    await wrapper.vm.$nextTick()

    const newBlRow = findAllBlRows(wrapper).at(5)
    const newBlRowInput = findBlAmountInput(newBlRow)
    triggerInputChange(newBlRowInput, '12000.44')

    await wrapper.vm.$nextTick()

    assert.equal(totalAmount.props('totalAmount'), 32000.44)

    removeBlRow(firstBlRow)
    await wrapper.vm.$nextTick()
    assert.equal(totalAmount.props('totalAmount'), 12000.44)
  })
})
