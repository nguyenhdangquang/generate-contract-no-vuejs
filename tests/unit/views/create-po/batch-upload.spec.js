import { assert } from 'chai'
import sinon from 'sinon'
import BatchUpload from '@/views/create-po/components/BatchUpload.vue'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import {
  findAllBlRows,
  findBlNumberInput,
  findBlAmountInput,
  findBlCurrencyInput,
  findBlRemarkInput,
  findBlNumberError,
  findBlAmountError
} from './utils'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import { createMockSettingsModule, createStore } from '../../store-utils'
import CreatePO from '@/views/create-po/Index.vue'
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

describe('Index.vue', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  describe('BatchUpload', () => {
    it('should render BatchUpload component', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePO, { store, localVue })
      await wrapper.vm.$nextTick()

      assert.isTrue(wrapper.findComponent(BatchUpload).exists())
    })

    it('should render blList updated from BatchUpload', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: {
              country: {
                ...baseSettings.country,
                defaultCurrency: {
                  code: 'SGD',
                  name: 'Singapore Dollar',
                  fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
                  bankMaxAmount: 200000,
                  decimalPlaces: '2',
                  thousandSeparator: ','
                }
              }
            }
          })
        })
      })

      const wrapper = await shallowMountPage(CreatePO, { store, localVue })

      const batchUpload = wrapper.findComponent(BatchUpload)
      batchUpload.vm.$emit('bl_list_update', [
        {
          no: 0,
          number: '123456789012',
          currency: 'SGD',
          amount: '10000.11',
          remark: 'Sample comment',
          error: '',
          numberError: null,
          amountError: null,
          remarkError: null
        }
      ])
      await wrapper.vm.$nextTick()

      const blRows = findAllBlRows(wrapper)
      assert.equal(blRows.length, 1)

      const firstBlRow = blRows.at(0)
      assert.equal(findBlNumberInput(firstBlRow).element.value, '123456789012')
      assert.equal(findBlAmountInput(firstBlRow).element.value, '10,000.11')
      assert.equal(findBlCurrencyInput(firstBlRow).element.textContent, 'SGD')
      assert.equal(findBlRemarkInput(firstBlRow).element.value, 'Sample comment')
    })

    it('should override current blList data', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: {
              country: {
                ...baseSettings.country,
                defaultCurrency: {
                  code: 'SGD',
                  name: 'Singapore Dollar',
                  fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
                  bankMaxAmount: 200000,
                  decimalPlaces: '2',
                  thousandSeparator: ','
                }
              }
            }
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePO, { store, localVue })

      const batchUpload = wrapper.findComponent(BatchUpload)
      batchUpload.vm.$emit('bl_list_update', [
        {
          no: 0,
          number: '123456789012',
          currency: 'SGD',
          amount: '10000',
          remark: '',
          error: '',
          numberError: null,
          amountError: null,
          remarkError: null
        }
      ])
      await wrapper.vm.$nextTick()

      const blRows = findAllBlRows(wrapper)
      assert.equal(blRows.length, 1)

      batchUpload.vm.$emit('bl_list_update', [
        {
          no: 0,
          number: 'abcdferhjklo',
          currency: 'VND',
          amount: '20000',
          remark: 'New comment',
          error: '',
          numberError: null,
          amountError: null,
          remarkError: null
        }
      ])
      await wrapper.vm.$nextTick()

      const firstBlRow = blRows.at(0)
      assert.equal(findBlNumberInput(firstBlRow).element.value, 'abcdferhjklo')
      assert.equal(findBlAmountInput(firstBlRow).element.value, '20,000.00')
      assert.equal(findBlCurrencyInput(firstBlRow).element.textContent, 'VND')
      assert.equal(findBlRemarkInput(firstBlRow).element.value, 'New comment')
    })

    it('should trigger error checking after filling data', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePO, { store, localVue, propsData: { countryCode: 'sg' } })

      const batchUpload = wrapper.findComponent(BatchUpload)
      batchUpload.vm.$emit('bl_list_update', [
        {
          no: 0,
          number: '',
          currency: 'SGD',
          amount: '',
          remark: '',
          error: '',
          numberError: null,
          amountError: null,
          remarkError: null
        }
      ])
      await wrapper.vm.$nextTick()

      const blRows = findAllBlRows(wrapper)
      assert.equal(blRows.length, 1)

      const blNumberError = findBlNumberError(wrapper, 0)
      const blAmountError = findBlAmountError(wrapper, 0)

      assert.equal(blAmountError.text(), ErrorMessage.BL_AMOUNT_REQUIRED)
      assert.equal(blNumberError.text(), ErrorMessage.BL_NUMBER_REQUIRED)
    })

    it('should check for duplicated bl numbers after filling data', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePO, { store, localVue, propsData: { countryCode: 'sg' } })

      const batchUpload = wrapper.findComponent(BatchUpload)
      batchUpload.vm.$emit('bl_list_update', [
        {
          no: 0,
          number: '123123',
          currency: 'SGD',
          amount: '',
          remark: '',
          error: '',
          numberError: null,
          amountError: null,
          remarkError: null
        },
        {
          no: 1,
          number: '442223',
          currency: 'SGD',
          amount: '',
          remark: '',
          error: '',
          numberError: null,
          amountError: null,
          remarkError: null
        },
        {
          no: 2,
          number: '123123',
          currency: 'SGD',
          amount: '',
          remark: '',
          error: '',
          numberError: null,
          amountError: null,
          remarkError: null
        }
      ])
      await wrapper.vm.$nextTick()

      const thirdBlNumberError = findBlNumberError(wrapper, 2)
      assert.equal(thirdBlNumberError.text(), ErrorMessage.BL_NUMBER_DUPLICATED)
    })
  })
})
