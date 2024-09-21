import { assert } from 'chai'
import sinon from 'sinon'
import { shallowMount } from '@vue/test-utils'
import CreatePOPage from '@/views/create-po/Index.vue'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import FloatingError from '@/components/FloatingError.vue'
import Layout from '@/components/Layout.vue'
import { getTextByCountry } from '@/utils/displayTextResources'
import { createAppLocalVue, shallowMountPage, triggerInputChange } from '../../utils'
import {
  fillBlRow,
  findAllBlRows,
  findBlAmountError,
  findBlAmountInput,
  findBlNumberError,
  findBlNumberInput,
  findBlRemarkInput,
  removeBlRow,
  findBlRemarkError
} from './utils'
import { createMockSettingsModule, createStore } from '../../store-utils'
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
const thailandBaseSettings = {
  country: {
    code: 'TH',
    defaultCurrency: {
      code: 'THB',
      name: 'Thai Baht',
      fileNameTemplateImport: 'files/Batch_Upload_Template_THB.xls',
      decimalPlaces: '2',
      thousandSeparator: ',',
      bankMaxAmount: 9999999999.99
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
  describe('Dowload file', () => {
    it('should render download template button', () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      const linkDownloadTemplate = wrapper.find('[data-testid="linkDownload"]')
      assert.isTrue(linkDownloadTemplate.attributes('href').includes('http://localhost/files/Batch_Upload_Template_SGD.xls'))
    })

    it('should render download template button - error', () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: {
              country: {
                ...baseSettings.country,
                defaultCurrency: null
              }
            }
          })
        })
      })

      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      const linkDownloadTemplate = wrapper.find('[data-testid="linkDownload"]')
      assert.isUndefined(linkDownloadTemplate.attributes('href'))
    })
  })

  it('should render 5 BL rows initially', async () => {
    window.scrollTo = () => {}
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(CreatePOPage, { store, localVue })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const blRows = findAllBlRows(wrapper)
    assert.equal(blRows.length, 5)
  })

  it('should show error maxBL when add button row over > 450 rows', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
    const addButton = wrapper.find('[data-testid="bl-add-button"]')
    for (let i = 0; i < 450; i++) {
      addButton.trigger('click')
    }
    await wrapper.vm.$nextTick()
    assert.equal(wrapper.find('[data-testid="error-max-bl"]').text(), getTextByCountry('SG', 'createPOPage_poContent_maxBLsRecord_errorMsg'))
  })

  it('should add bl row after clicking add button', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
    const addButton = wrapper.find('[data-testid="bl-add-button"]')
    addButton.trigger('click')
    await wrapper.vm.$nextTick()
    const blRows = findAllBlRows(wrapper)
    assert.equal(blRows.length, 6)
    assert.equal(wrapper.vm.$data.hasChangedData, true)
  })

  it('should remove bl row after clicking delete button', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(CreatePOPage, { store, localVue })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const firstBlRow = findAllBlRows(wrapper).at(0)
    removeBlRow(firstBlRow)

    await wrapper.vm.$nextTick()
    const blRows = findAllBlRows(wrapper)
    assert.equal(blRows.length, 4)
    assert.equal(wrapper.vm.$data.hasChangedData, true)
  })

  it('should remove event listener beforeunload', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const stubListener = sinon.stub(window, 'removeEventListener')
    const wrapper = shallowMount(CreatePOPage, { store, localVue })
    wrapper.vm.$destroy()

    assert.isTrue(stubListener.calledOnce)
  })

  it('should emit change flag event of Layout', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(CreatePOPage, { store, localVue })
    const layoutComponent = wrapper.findComponent(Layout)
    layoutComponent.vm.$emit('confirmChangeFlag')

    assert.isTrue(wrapper.vm.$data.isChangingFlag)
  })

  describe('beforeRouteLeave', () => {
    it('should allow refresh page with path have not change url', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
      const nextObject = {
        nextFun: () => {
          return true
        }
      }
      const spyNext = sinon.spy(nextObject, 'nextFun')
      beforeRouteLeave.call(wrapper.vm, { path: '/create-po' }, { path: '/create-po' }, nextObject.nextFun)

      sinon.assert.calledOnce(spyNext)
    })

    it('should allow redirect page after clicked submit data', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
      const nextObject = {
        nextFun: () => {
          return true
        }
      }
      const spyNext = sinon.spy(nextObject, 'nextFun')
      wrapper.vm.isSubmittingData = true
      beforeRouteLeave.call(wrapper.vm, { path: '/create-po' }, { path: '/pay-po' }, nextObject.nextFun)

      sinon.assert.calledOnce(spyNext)
    })

    it('should open navigation modal when state of page is readonly', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
      const nextObject = {
        nextFun: () => {
          return true
        }
      }
      const spyNext = sinon.spy(nextObject, 'nextFun')
      const stubNavigate = sinon.stub(wrapper.vm, 'triggerRouterGuard').resolves(true)
      wrapper.vm.$data.readonlyMode = true
      beforeRouteLeave.call(wrapper.vm, { path: '/create-po' }, { path: '/' }, nextObject.nextFun)

      sinon.assert.calledOnce(stubNavigate)
      sinon.assert.notCalled(spyNext)
    })

    it('should allow redirect page after open created PO modal', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
      const nextObject = {
        nextFun: () => {
          return true
        }
      }
      const spyNext = sinon.spy(nextObject, 'nextFun')
      wrapper.vm.$data.isOpenCreatedPODialog = true
      beforeRouteLeave.call(wrapper.vm, { path: '/create-po' }, { path: '/' }, nextObject.nextFun)

      sinon.assert.calledOnce(spyNext)
    })
  })

  describe('handleBeforeUnload', () => {
    it('should do not display browser popup when changing country', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const event = {
        preventDefault: () => { return true },
        returnValue: '1234'
      }
      const spy = sinon.spy(event, 'preventDefault')
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      wrapper.vm.$data.isChangingFlag = true
      wrapper.vm.handleBeforeUnload(event)

      assert.isTrue(spy.notCalled)
      assert.isNotEmpty(event.returnValue)
    })

    it('should display browser popup when is readonly mode', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const event = {
        preventDefault: () => { return true },
        returnValue: '1234'
      }
      const spy = sinon.spy(event, 'preventDefault')
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      wrapper.vm.$data.readonlyMode = true
      wrapper.vm.handleBeforeUnload(event)

      assert.isTrue(spy.calledOnce)
      assert.isEmpty(event.returnValue)
    })

    it('should do not display browser popup when has not changed data', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const event = {
        preventDefault: () => { return true },
        returnValue: '1234'
      }
      const spy = sinon.spy(event, 'preventDefault')
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      wrapper.vm.handleBeforeUnload(event)

      assert.isTrue(spy.notCalled)
      assert.isNotEmpty(event.returnValue)
    })

    it('should display browser popup when has changed data', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const event = {
        preventDefault: () => { return true },
        returnValue: '1234'
      }
      const spy = sinon.spy(event, 'preventDefault')
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      wrapper.vm.$data.hasChangedData = true
      wrapper.vm.handleBeforeUnload(event)

      assert.isTrue(spy.calledOnce)
      assert.isEmpty(event.returnValue)
    })
  })

  describe('BL number input', () => {
    it('should show error when BL number is empty', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blNumberInput = findBlNumberInput(firstBlRow)
      blNumberInput.trigger('blur')

      await wrapper.vm.$nextTick()
      assert.isTrue(blNumberInput.classes().includes('error-controls'))

      const blNumberError = findBlNumberError(wrapper, 0)
      assert.equal(blNumberError.text(), ErrorMessage.BL_NUMBER_REQUIRED)
      assert.equal(wrapper.vm.$data.hasChangedData, true)
    })

    it('should update BL number of blList', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })

      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blNumberInput = findBlNumberInput(firstBlRow)
      blNumberInput.element.value = 'SG213123213'
      blNumberInput.trigger('input')
      await wrapper.vm.$nextTick()

      assert.equal(wrapper.vm.$data.blList[0].number, 'SG213123213')
      assert.isTrue(wrapper.vm.$data.hasChangedData)
    })

    it('should show error when BL number contain more than 16 characters', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blNumberInput = findBlNumberInput(firstBlRow)

      triggerInputChange(blNumberInput, 'longnumberwithmorethan16characters')
      await wrapper.vm.$nextTick()

      assert.isTrue(blNumberInput.classes().includes('error-controls'))

      const blNumberError = findBlNumberError(wrapper, 0)
      assert.equal(blNumberError.text(), ErrorMessage.BL_NUMBER_LENGTH_16)
    })

    it('should trigger validate after enter valid value', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blNumberInput = findBlNumberInput(firstBlRow)

      triggerInputChange(blNumberInput, 'longnumberwithmorethan16characters')
      await wrapper.vm.$nextTick()

      assert.isTrue(blNumberInput.classes().includes('error-controls'))

      let blNumberError = findBlNumberError(wrapper, 0)
      assert.equal(blNumberError.text(), ErrorMessage.BL_NUMBER_LENGTH_16)

      triggerInputChange(blNumberInput, '12345')
      await wrapper.vm.$nextTick()

      blNumberError = findBlNumberError(wrapper, 0)
      assert.isFalse(blNumberInput.classes().includes('error-controls'))
      assert.isFalse(blNumberError.exists())
    })

    it('should be valid when input 12 characters', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blNumberInput = findBlNumberInput(firstBlRow)

      triggerInputChange(blNumberInput, '123456789012')
      await wrapper.vm.$nextTick()

      const blNumberError = findBlNumberError(wrapper, 0)
      assert.isFalse(blNumberError.exists())
      assert.isTrue(wrapper.vm.$data.hasChangedData)
    })

    it('should be valid when input 12 characters and contain space', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blNumberInput = findBlNumberInput(firstBlRow)

      triggerInputChange(blNumberInput, '  123456789012  ')
      await wrapper.vm.$nextTick()

      const blNumberError = findBlNumberError(wrapper, 0)
      assert.isFalse(blNumberError.exists())
    })

    it('should check for duplicated bl number', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const firstBlNumberInput = findBlNumberInput(firstBlRow)
      triggerInputChange(firstBlNumberInput, '111222')

      const fourthBlRow = findAllBlRows(wrapper).at(3)
      const fourthBlNumberInput = findBlNumberInput(fourthBlRow)
      triggerInputChange(fourthBlNumberInput, '111222')

      await wrapper.vm.$nextTick()
      const fourthBlNumberError = findBlNumberError(wrapper, 3)

      assert.isTrue(fourthBlNumberInput.classes().includes('error-controls'))
      assert.equal(fourthBlNumberError.text(), ErrorMessage.BL_NUMBER_DUPLICATED)
    })

    it('should re-trigger check for duplicated bl number when making changes', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const firstBlNumberInput = findBlNumberInput(firstBlRow)
      triggerInputChange(firstBlNumberInput, '111222')

      const fourthBlRow = findAllBlRows(wrapper).at(3)
      const fourthBlNumberInput = findBlNumberInput(fourthBlRow)
      triggerInputChange(fourthBlNumberInput, '111222')

      await wrapper.vm.$nextTick()
      let fourthBlNumberError = findBlNumberError(wrapper, 3)

      assert.isTrue(fourthBlNumberInput.classes().includes('error-controls'))
      assert.equal(fourthBlNumberError.text(), ErrorMessage.BL_NUMBER_DUPLICATED)

      triggerInputChange(firstBlNumberInput, '12345')
      await wrapper.vm.$nextTick()

      fourthBlNumberError = findBlNumberError(wrapper, 3)
      assert.isFalse(fourthBlNumberInput.classes().includes('error-controls'))
      assert.isFalse(fourthBlNumberError.exists())
    })

    it('should re-trigger check for duplicated bl number when deleting bls', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })

      const blRows = findAllBlRows(wrapper)

      const firstBlRow = blRows.at(0)
      fillBlRow(firstBlRow, { number: 'abcde', amount: null, remark: null })

      const secondBlRow = blRows.at(1)
      fillBlRow(secondBlRow, { number: 'abcde', amount: null, remark: null })

      await wrapper.vm.$nextTick()

      const firstBlNumberError = findBlNumberError(wrapper, 0)
      let secondBlNumberError = findBlNumberError(wrapper, 1)

      assert.equal(firstBlNumberError.text(), ErrorMessage.BL_NUMBER_DUPLICATED)
      assert.equal(secondBlNumberError.text(), ErrorMessage.BL_NUMBER_DUPLICATED)

      removeBlRow(firstBlRow)
      await wrapper.vm.$nextTick()

      secondBlNumberError = findBlNumberError(wrapper, 1)
      assert.isFalse(secondBlNumberError.exists())
    })
  })

  describe('Bl amount input', () => {
    it('should show error when BL amount is empty', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blAmountInput = findBlAmountInput(firstBlRow)
      blAmountInput.trigger('blur')

      await wrapper.vm.$nextTick()

      assert.isTrue(blAmountInput.classes().includes('error-controls'))

      const blAmountError = findBlAmountError(wrapper, 0)
      assert.equal(blAmountError.text(), ErrorMessage.BL_AMOUNT_REQUIRED)
      assert.equal(wrapper.vm.$data.hasChangedData, true)
    })

    it('should update amount of blList', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })

      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blAmountInput = findBlAmountInput(firstBlRow)
      blAmountInput.element.value = '123456'
      blAmountInput.trigger('input')
      await wrapper.vm.$nextTick()

      assert.equal(wrapper.vm.$data.blList[0].amount, '123456')
      assert.isTrue(wrapper.vm.$data.hasChangedData)
    })

    it('should format currency', async () => {
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

      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blAmountInput = findBlAmountInput(firstBlRow)
      triggerInputChange(blAmountInput, '123456')

      await wrapper.vm.$nextTick()
      assert.equal(blAmountInput.element.value, '123,456.00')
    })

    it('should format currency for case thousandSeparator is "." and decimalPlaces 0', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: {
              country: {
                ...baseSettings.country,
                defaultCurrency: {
                  code: 'IDR',
                  name: 'Indonesian Rupiah',
                  fileNameTemplateImport: 'files/Batch_Upload_Template_IDR.xls',
                  bankMaxAmount: 200000,
                  decimalPlaces: 0,
                  thousandSeparator: '.'
                }
              }
            }
          })
        })
      })

      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blAmountInput = findBlAmountInput(firstBlRow)
      triggerInputChange(blAmountInput, '123456')

      await wrapper.vm.$nextTick()
      assert.equal(blAmountInput.element.value, '123.456')
    })

    it('should only render 2 numbers in the fractional part', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blAmountInput = findBlAmountInput(firstBlRow)
      triggerInputChange(blAmountInput, '123.456789')

      await wrapper.vm.$nextTick()
      assert.equal(blAmountInput.element.value, '123.45')
    })

    describe('restrictOnlyAmountOnKeydown', () => {
      it('should nothing when press Backspace if amount is empty', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const wrapper = shallowMount(CreatePOPage, { store, localVue })
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        let firstBlRow = findAllBlRows(wrapper).at(0)
        let blAmountInput = findBlAmountInput(firstBlRow)
        blAmountInput.element.value = ''
        blAmountInput.trigger('keydown', {
          key: 'Backspace'
        })
        await wrapper.vm.$nextTick()

        firstBlRow = findAllBlRows(wrapper).at(0)
        blAmountInput = findBlAmountInput(firstBlRow)
        assert.equal(blAmountInput.element.value, '')
      })

      it('should nothing when press Delete if amount is empty', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const wrapper = shallowMount(CreatePOPage, { store, localVue })
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        let firstBlRow = findAllBlRows(wrapper).at(0)
        let blAmountInput = findBlAmountInput(firstBlRow)
        blAmountInput.element.value = ''
        blAmountInput.trigger('keydown', {
          key: 'Delete'
        })
        await wrapper.vm.$nextTick()

        firstBlRow = findAllBlRows(wrapper).at(0)
        blAmountInput = findBlAmountInput(firstBlRow)
        assert.equal(blAmountInput.element.value, '')
      })

      it('should remove selection text when press Del if amount is text left', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const event = {
          key: 'Del',
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        const firstBlRow = findAllBlRows(wrapper).at(0)
        const blAmountInput = findBlAmountInput(firstBlRow)
        blAmountInput.element.value = '1234'
        blAmountInput.trigger('input')
        blAmountInput.element.setSelectionRange(0, 3)
        blAmountInput.trigger('keydown', event)

        assert.isTrue(spy.notCalled)
      })

      it('should not be able input if number of character is more than 7 characters', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const event = {
          key: 'Del',
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        const firstBlRow = findAllBlRows(wrapper).at(0)
        const blAmountInput = findBlAmountInput(firstBlRow)
        blAmountInput.element.value = '123456.78'
        blAmountInput.trigger('input')
        blAmountInput.element.setSelectionRange(6, 7)
        blAmountInput.trigger('keydown', event)

        assert.isTrue(spy.calledOnce)
      })

      it('should be able input if number of character is less than 7 characters', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const event = {
          key: 'Del',
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        const firstBlRow = findAllBlRows(wrapper).at(0)
        const blAmountInput = findBlAmountInput(firstBlRow)
        blAmountInput.element.value = '12345.'
        blAmountInput.trigger('input')
        blAmountInput.element.setSelectionRange(5, 6)
        blAmountInput.trigger('keydown', event)

        assert.isTrue(spy.notCalled)
      })

      it('Thailand - should not be able input if number of chracter is more than 10', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: thailandBaseSettings
            })
          })
        })

        const event = {
          key: 'Del',
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        const firstBlRow = findAllBlRows(wrapper).at(0)
        const blAmountInput = findBlAmountInput(firstBlRow)
        blAmountInput.element.value = '9999999999.99'
        blAmountInput.trigger('input')
        blAmountInput.element.setSelectionRange(10, 11)
        blAmountInput.trigger('keydown', event)
        assert.isTrue(spy.calledOnce)
      })
      it('Thailand - should be able input if number of chracter is more than 10', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: thailandBaseSettings
            })
          })
        })

        const event = {
          key: 'Del',
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        const firstBlRow = findAllBlRows(wrapper).at(0)
        const blAmountInput = findBlAmountInput(firstBlRow)
        blAmountInput.element.value = '9999999999.'
        blAmountInput.trigger('input')
        blAmountInput.element.setSelectionRange(10, 11)
        blAmountInput.trigger('keydown', event)

        assert.isTrue(spy.notCalled)
      })
    })

    describe('restrictOnlyAmountOnKeypress', () => {
      it('should not be able input when amount is being empty and then input dot character', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const event = {
          which: 46,
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        wrapper.vm.restrictOnlyAmountOnKeypress(event, { amount: '' })

        assert.isTrue(spy.calledOnce)
      })

      it('should not be able input when input over max length', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const event = {
          which: 57,
          key: 57,
          target: {
            selectionStart: 0,
            selectionEnd: 0,
            value: 123456.7
          },
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        wrapper.vm.restrictOnlyAmountOnKeypress(event, { amount: '123456.7' })

        assert.isTrue(spy.calledOnce)
      })

      it('should not be able input when input over max length for case decimalPlaces === 0', async () => {
        const settings = {
          country: {
            code: 'ID',
            defaultCurrency: {
              code: 'IDR',
              name: 'Indonesian Rupiah',
              fileNameTemplateImport: 'files/Batch_Upload_Template_IDR.xls',
              decimalPlaces: 0,
              thousandSeparator: '.',
              bankMaxAmount: 200000
            }
          }
        }
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: settings
            })
          })
        })

        const event = {
          which: 57,
          key: 57,
          target: {
            selectionStart: 0,
            selectionEnd: 0,
            value: 123456.7
          },
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        wrapper.vm.restrictOnlyAmountOnKeypress(event, { amount: '123456.7' })

        assert.isTrue(spy.calledOnce)
      })

      it('should be able input when replace a character of invalid amount', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const event = {
          which: 46,
          target: {
            selectionStart: 3,
            selectionEnd: 4,
            value: 123456
          },
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        wrapper.vm.restrictOnlyAmountOnKeypress(event, { amount: '123456' })

        assert.isTrue(spy.notCalled)
      })
    })

    describe('restrictOnlyNumber', () => {
      it('should be able input when valid amount replaced some number', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const event = {
          which: 57,
          target: {
            value: 123456.7
          },
          preventDefault: () => { return true }
        }
        const spy = sinon.spy(event, 'preventDefault')
        const wrapper = shallowMount(CreatePOPage, { store, localVue })

        wrapper.vm.restrictOnlyNumber(event)

        assert.isTrue(spy.notCalled)
      })
    })
  })

  describe('BL remark input', () => {
    const invalidRemarkStr = (function createLongRemark () {
      return Array.from({ length: 2001 }, () => 'a').join('')
    })()

    it('should update remark of blList', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })

      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blRemarkInput = findBlRemarkInput(firstBlRow)
      blRemarkInput.element.value = 'asdasdasd'
      blRemarkInput.trigger('input')
      await wrapper.vm.$nextTick()

      assert.equal(wrapper.vm.$data.blList[0].remark, 'asdasdasd')
      assert.isTrue(wrapper.vm.$data.hasChangedData)
    })

    it('should show error when input more than 2000 characters', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blRemarkInput = findBlRemarkInput(firstBlRow)

      triggerInputChange(blRemarkInput, invalidRemarkStr)

      await wrapper.vm.$nextTick()
      assert.isTrue(blRemarkInput.classes().includes('error-controls'))

      const blRemarkError = findBlRemarkError(wrapper, 0)
      assert.equal(blRemarkError.text(), ErrorMessage.REMARK_MAX_LENGTH_2000)
      assert.equal(wrapper.vm.$data.hasChangedData, true)
    })
  })

  describe('Floating Error Component', () => {
    it('should render Floating Error Component', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, {
        store,
        localVue
      })
      await wrapper.vm.$nextTick()
      const floatingErrors = [
        {
          no: 1,
          number: '',
          currency: 'SGD',
          amount: '',
          remark: '',
          numberError: 'It\'s required. Please input the B/L or Invoice number.',
          amountError: null,
          remarkError: null
        },
        {
          no: 2,
          number: '',
          currency: 'SGD',
          amount: '',
          remark: '',
          numberError: 'It\'s required. Please input the B/L or Invoice amount.',
          amountError: 'It\'s required. Please input the B/L or Invoice amount.',
          remarkError: null
        }
      ]
      wrapper.setData({ floatingErrors })
      assert.equal(wrapper.vm.floatingErrors.length, 2)
      assert.isTrue(wrapper.findComponent(FloatingError).isVisible())
    })
  })

  describe('Receivable Office', () => {
    it('should show receivable office', async () => {
      const _settings = {
        country: {
          code: 'SG',
          defaultCurrency: {
            code: 'SGD',
            name: 'Singapore Dollar',
            fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
            decimalPlaces: '2',
            thousandSeparator: ',',
            bankMaxAmount: 200000
          },
          defaultReceivableOffice: {
            address: '2 Harbourfront Place, #06-01, SINGAPORE 098499',
            officeName: 'SINGAPORE'
          }
        }
      }
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: _settings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const officeName = wrapper.find('[data-testid="receivable-office-name"]').text()
      const officeAddress = wrapper.find('[data-testid="receivable-office-address"]').text()

      assert.equal(officeName, _settings.country.defaultReceivableOffice.officeName)
      assert.equal(officeAddress, _settings.country.defaultReceivableOffice.address)
      assert.equal(officeName, wrapper.vm.defaultReceivableOffice.officeName)
      assert.equal(officeAddress, wrapper.vm.defaultReceivableOffice.address)
    })

    it('should show empty receivable office with country null', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: null
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const officeName = wrapper.find('[data-testid="receivable-office-name"]').text()
      const officeAddress = wrapper.find('[data-testid="receivable-office-address"]').text()

      assert.equal(officeName, '')
      assert.equal(officeAddress, '')
      assert.isUndefined(wrapper.vm.defaultReceivableOffice.officeName)
      assert.isUndefined(wrapper.vm.defaultReceivableOffice.address)
    })

    it('should show empty receivable office with defaultReceivableOffice null', async () => {
      const _settings = {
        country: {
          code: 'SG',
          defaultCurrency: {
            code: 'SGD',
            name: 'Singapore Dollar',
            fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
            decimalPlaces: '2',
            thousandSeparator: ',',
            bankMaxAmount: 200000
          },
          defaultReceivableOffice: null
        }
      }
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: _settings
          })
        })
      })
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const officeName = wrapper.find('[data-testid="receivable-office-name"]').text()
      const officeAddress = wrapper.find('[data-testid="receivable-office-address"]').text()

      assert.equal(officeName, '')
      assert.equal(officeAddress, '')
      assert.isUndefined(wrapper.vm.defaultReceivableOffice.officeName)
      assert.isUndefined(wrapper.vm.defaultReceivableOffice.address)
    })

    it('dot (.) thousandSep format', async () => {
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
                  thousandSeparator: '.'
                }
              }
            }
          })
        })
      })

      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blAmountInput = findBlAmountInput(firstBlRow)
      triggerInputChange(blAmountInput, '123456')

      await wrapper.vm.$nextTick()
      assert.equal(blAmountInput.element.value, '123.456,00')
    })
  })

  describe('Handle restrictOnlyAmountOnKeydown event', () => {
    const bl = {
      number: 'abcd',
      currency: 'SGD',
      amount: '20000',
      remark: null
    }
    it('restrictOnlyAmountOnKeydown Event on IE', async () => {
      const _settings = {
        country: {
          code: 'SG',
          defaultCurrency: {
            code: 'SGD',
            name: 'Singapore Dollar',
            fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
            decimalPlaces: '2',
            thousandSeparator: ',',
            bankMaxAmount: 200000
          },
          defaultReceivableOffice: null
        }
      }
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: _settings
          })
        })
      })

      const event = {
        key: 'Backspace',
        target: {
          selectionStart: 3,
          selectionEnd: 3,
          value: 343342.34
        }
      }
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blAmountInput = findBlAmountInput(firstBlRow)
      blAmountInput.trigger('keydown', { event, bl })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      assert.isNotNull(blAmountInput)
    })
  })

  describe('Handle restrictOnlyAmountOnKeypress event', () => {
    const bl = {
      number: 'abcd',
      currency: 'SGD',
      amount: '',
      remark: null
    }
    it('restrictOnlyAmountOnKeypress Event on IE', async () => {
      const _settings = {
        country: {
          code: 'SG',
          defaultCurrency: {
            code: 'SGD',
            name: 'Singapore Dollar',
            fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
            decimalPlaces: '2',
            thousandSeparator: ',',
            bankMaxAmount: 200000
          },
          defaultReceivableOffice: null
        }
      }
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: _settings
          })
        })
      })

      const event = {
        key: 'Backspace',
        target: {
          selectionStart: 3,
          selectionEnd: 3,
          value: 343342.34
        }
      }
      const wrapper = shallowMount(CreatePOPage, { store, localVue })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      const firstBlRow = findAllBlRows(wrapper).at(0)
      const blAmountInput = findBlAmountInput(firstBlRow)
      blAmountInput.trigger('keypress', { event, bl })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      assert.isNotNull(blAmountInput)
    })
  })
})
