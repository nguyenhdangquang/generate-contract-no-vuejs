import { assert } from 'chai'
import sinon from 'sinon'
import Loading from '@/components/Loading.vue'
import * as PurchaseOrders from '@/repositories/PurchaseOrders'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import {
  fillBlRow,
  fillPayerInformationForm,
  findAllBlRows,
  findBlNumberError,
  findSaveAndProceedToPayButton,
  removeBlRow
} from './utils'
import { createMockSettingsModule, createStore } from '../../store-utils'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import FloatingError from '@/components/FloatingError.vue'
import { BL_NUMBER_ERRORS } from '@/views/create-po/utils/errors'
import CreatePOPage from '@/views/create-po/Index.vue'
import StorageHelper from '@/utils/storageHelper'
import DialogConfirmNavigation from '@/components/dialog/DialogConfirmNavigation.vue'

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

describe('Index.vue', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })
  describe('Save and proceed to pay', () => {
    it('should render save and proceed to pay button', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

      assert.isTrue(proceedToPayButton.isVisible())
      assert.equal(proceedToPayButton.text(), 'Save and Proceed to Pay')
    })

    it('should disable save and proceed to pay button by default', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

      assert.isTrue(proceedToPayButton.props('disabled'))
    })

    it('should enable SAPTP button if form is valid', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

      fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678901' })

      const firstBlRow = findAllBlRows(wrapper).at(0)
      fillBlRow(firstBlRow)

      await wrapper.vm.$nextTick()

      assert.isFalse(proceedToPayButton.props('disabled'))
    })

    it('should disable SAPTP button if all bl rows are empty', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

      fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678901' })

      const firstBlRow = findAllBlRows(wrapper).at(0)
      fillBlRow(firstBlRow)

      await wrapper.vm.$nextTick()

      assert.isFalse(proceedToPayButton.props('disabled'))

      removeBlRow(firstBlRow)
      await wrapper.vm.$nextTick()

      assert.isTrue(proceedToPayButton.props('disabled'))
    })

    it('should disable SAPTP button if there are duplicated bls', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

      fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678901' })

      const allBlRows = findAllBlRows(wrapper)
      const firstBlRow = allBlRows.at(0)
      fillBlRow(firstBlRow, { number: 'abcd' })

      await wrapper.vm.$nextTick()

      assert.isFalse(proceedToPayButton.props('disabled'))

      const secondBlRow = allBlRows.at(1)
      fillBlRow(secondBlRow, { number: 'abcd' })
      await wrapper.vm.$nextTick()

      assert.isTrue(proceedToPayButton.props('disabled'))
    })

    it('should re-enable SAPTP button if duplicated bls were fixed', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

      fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678901' })

      const allBlRows = findAllBlRows(wrapper)
      const firstBlRow = allBlRows.at(0)
      fillBlRow(firstBlRow, { number: 'abcd' })

      await wrapper.vm.$nextTick()

      assert.isFalse(proceedToPayButton.props('disabled'))

      const secondBlRow = allBlRows.at(1)
      fillBlRow(secondBlRow, { number: 'abcd' })
      await wrapper.vm.$nextTick()

      assert.isTrue(proceedToPayButton.props('disabled'))

      removeBlRow(secondBlRow)
      await wrapper.vm.$nextTick()
      assert.isFalse(proceedToPayButton.props('disabled'))
    })

    it('should re-enable SAPTP button if invalid bls were fixed', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
      const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

      fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678901' })

      const allBlRows = findAllBlRows(wrapper)
      const firstBlRow = allBlRows.at(0)
      fillBlRow(firstBlRow, { number: 'abcd', amount: null })

      await wrapper.vm.$nextTick()

      assert.isTrue(proceedToPayButton.props('disabled'))

      fillBlRow(firstBlRow, { number: 'abcd', amount: '20000' })
      await wrapper.vm.$nextTick()
      assert.isFalse(proceedToPayButton.props('disabled'))
    })

    it('should dispatch action clearGlobalError when leaving route - click confirm on popup navigation', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })

      let calledCount = 0
      const unsubscribe = store.subscribeAction((action) => {
        if (action.type === 'application/clearError') {
          calledCount += 1
        }
      })

      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      wrapper.vm.$data.hasChangedData = true
      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
      const nextFun = sinon.stub()

      beforeRouteLeave.call(wrapper.vm, { path: '/' }, { path: '/create-po' }, nextFun)

      const dialogConfirmNavigation = wrapper.findComponent(DialogConfirmNavigation)
      dialogConfirmNavigation.vm.$emit('confirm')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      assert.isTrue(nextFun.calledOnce)
      assert.equal(calledCount, 1)
      assert.equal(wrapper.vm.$data.isOpenModalNavigation, false)

      unsubscribe()
    })

    it('should dispatch action clearGlobalError when leaving route - click discard on popup navigation', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })

      let calledCount = 0
      const unsubscribe = store.subscribeAction((action) => {
        if (action.type === 'application/clearError') {
          calledCount += 1
        }
      })

      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      wrapper.vm.$data.hasChangedData = true
      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave[0]
      const nextFun = sinon.stub()

      beforeRouteLeave.call(wrapper.vm, { path: '/' }, { path: '/create-po' }, nextFun)

      const dialogConfirmNavigation = wrapper.findComponent(DialogConfirmNavigation)
      dialogConfirmNavigation.vm.$emit('discard')

      assert.isTrue(nextFun.notCalled)
      assert.equal(calledCount, 0)
      assert.equal(wrapper.vm.$data.isOpenModalNavigation, false)

      unsubscribe()
    })

    describe('api', () => {
      it('should show loading state when clicking SAPTP button', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })
        sinon.stub(PurchaseOrders, 'create')

        const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
        const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

        fillPayerInformationForm(wrapper, {
          company: 'Company A',
          contactNumber: '45678965',
          email: 'a@a.com'
        })

        const allBlRows = findAllBlRows(wrapper)

        const firstBlRow = allBlRows.at(0)
        fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

        const secondBlRow = allBlRows.at(1)
        fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

        proceedToPayButton.vm.$emit('click')
        await wrapper.vm.$nextTick()
        const loadingComponent = wrapper.findComponent(Loading)
        assert.isTrue(loadingComponent.isVisible())
      })

      it('should call create PO api when clicking SAPTP', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })
        const sampleCreatedPO = {
          id: 1234567,
          companyName: 'Company A',
          contactNumber: '45678965',
          email: 'a@a.com'
        }
        const createPOStub = sinon.stub(PurchaseOrders, 'create')
          .resolves(sampleCreatedPO)

        const wrapper = await shallowMountPage(CreatePOPage, {
          store,
          localVue,
          propsData: {
            countryCode: 'sg'
          }
        })
        const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

        fillPayerInformationForm(wrapper, {
          company: 'Company A',
          contactNumber: '12345678901',
          email: 'a@a.com'
        })

        const allBlRows = findAllBlRows(wrapper)

        const firstBlRow = allBlRows.at(0)
        fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

        const secondBlRow = allBlRows.at(1)
        fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

        await wrapper.vm.$nextTick()

        assert.isFalse(proceedToPayButton.props('disabled'))
        proceedToPayButton.vm.$emit('click')

        assert.isTrue(createPOStub.calledOnce)
        assert.deepEqual(createPOStub.args[0][0], {
          companyName: 'Company A',
          contactNumber: '12345678901',
          emailAddress: 'a@a.com',
          countryCode: baseSettings.country.code,
          areaCode: baseSettings.country.areaCode,
          blInvList: [
            {
              number: 'abcd',
              currency: 'SGD',
              amount: 20000,
              remark: null
            },
            {
              number: 'abcde',
              currency: 'SGD',
              amount: 30000,
              remark: null
            }
          ]
        })
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        assert.deepEqual(store.getters['purchaseOrder/createdPO'], sampleCreatedPO)
        assert.equal(wrapper.vm.$router.currentRoute.path, '/sg/pay-po')
      })

      it('should show bl number not found errors', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })
        sinon.stub(PurchaseOrders, 'create')
          .throws({
            errors: [
              {
                code: 'BL_INVOICE_NUMBER_IS_NOT_EXISTED',
                field: 'blInv/abcde/number',
                message: 'Your BL or Invoice number does not exist. Please enter a valid number.'
              },
              {
                code: 'BL_INVOICE_NUMBER_IS_NOT_EXISTED',
                field: 'blInv/12345/number',
                message: 'Your BL or Invoice number does not exist. Please enter a valid number.'
              }
            ]
          })

        const wrapper = await shallowMountPage(CreatePOPage, { store, localVue, propsData: { countryCode: 'sg' } })
        const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

        fillPayerInformationForm(wrapper, {
          company: 'Company A',
          contactNumber: '45678965',
          email: 'a@a.com'
        })

        const allBlRows = findAllBlRows(wrapper)

        const firstBlRow = allBlRows.at(0)
        fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

        const secondBlRow = allBlRows.at(1)
        fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

        const thirdBlRow = allBlRows.at(2)
        fillBlRow(thirdBlRow, { number: '12345', amount: '30000', remark: null })

        await wrapper.vm.$nextTick()
        proceedToPayButton.vm.$emit('click')
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        assert.equal(findBlNumberError(wrapper, 1).text(), ErrorMessage.BL_NUMBER_NOT_EXISTS)
        assert.equal(findBlNumberError(wrapper, 2).text(), ErrorMessage.BL_NUMBER_NOT_EXISTS)

        const floatingError = wrapper.findComponent(FloatingError)
        assert.isTrue(floatingError.isVisible())
        const floatingErrorProps = floatingError.props('floatingErrors')
        assert.equal(floatingErrorProps.length, 2)
        assert.deepEqual(floatingErrorProps[0].numberError, BL_NUMBER_ERRORS.NotExists)
        assert.deepEqual(floatingErrorProps[1].numberError, BL_NUMBER_ERRORS.NotExists)
      })

      it('should show global error with general error response', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        sinon.stub(PurchaseOrders, 'create')
          .throws({
            errors: [
              {
                code: 'SETTING_IS_NOT_FOUND',
                field: '',
                message: 'Setting is not found.'
              }
            ]
          })

        const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
        const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

        fillPayerInformationForm(wrapper, {
          company: 'Company A',
          contactNumber: '45678965',
          email: 'a@a.com'
        })

        const allBlRows = findAllBlRows(wrapper)

        const firstBlRow = allBlRows.at(0)
        fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

        const secondBlRow = allBlRows.at(1)
        fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

        proceedToPayButton.vm.$emit('click')
        await wrapper.vm.$nextTick()

        assert.isNotNull(store.state.application.error)
        assert.equal(store.state.application.error.title, 'Something went wrong')
        assert.equal(store.state.application.error.message, 'Could not complete the operation due to network problem')
      })

      it('should show global error popup with unexpected error', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        sinon.stub(PurchaseOrders, 'create')
          .throws({
            message: 'Network Error'
          })

        const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
        const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

        fillPayerInformationForm(wrapper, {
          company: 'Company A',
          contactNumber: '45678965',
          email: 'a@a.com'
        })

        const allBlRows = findAllBlRows(wrapper)

        const firstBlRow = allBlRows.at(0)
        fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

        const secondBlRow = allBlRows.at(1)
        fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

        proceedToPayButton.vm.$emit('click')
        await wrapper.vm.$nextTick()

        assert.isNotNull(store.state.application.error)
        assert.equal(store.state.application.error.title, 'Something went wrong')
        assert.equal(store.state.application.error.message, 'Could not complete the operation due to network problem')
      })
    })

    describe('Contact form', () => {
      describe('Email field', () => {
        it('should disable SAPTP button if email is missing', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: '12345678901',
            email: ''
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            email: 'test@gmail.com'
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })

        it('should disable SAPTP button if email has more than 200 characters', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: '12345678901',
            email: Array.from({ length: 201 }, () => 'a').join('')
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            email: Array.from({ length: 190 }, () => 'a').join('') + '@gmail.com'
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })

        it('should disable SAPTP button if email contains special characters', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: '12345678901',
            email: 'abc%^@gmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            email: 'abc@gmail.com'
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })

        it('should disable SAPTP button if email doesn\'t contain at sign', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: '12345678901',
            email: 'abcgmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            email: 'abc@gmail.com'
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })

        it('should display email error from response', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const createPOStub = sinon.stub(PurchaseOrders, 'create')
            .throws({
              errors: [
                {
                  code: 'EMAIL_ADDRESS_IS_INVALID',
                  field: 'emailAddress'
                }
              ]
            })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: '12345678901',
            email: 'abc@gmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isFalse(proceedToPayButton.props('disabled'))
          proceedToPayButton.vm.$emit('click')

          await wrapper.vm.$nextTick()

          assert.isTrue(createPOStub.calledOnce)

          assert.isFalse(proceedToPayButton.props('disabled'))
        })
      })

      describe('Company Name field', () => {
        it('should disable SAPTP button if company name is missing', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: '',
            contactNumber: '12345678901',
            email: 'a@gmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            company: 'Company A'
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })

        it('should disable SAPTP button if company name name contains more than 200 characters', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: Array.from({ length: 201 }, () => 'a').join(''),
            contactNumber: '12345678901',
            email: 'a@gmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            company: Array.from({ length: 200 }, () => 'a').join('')
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })

        it('should display company name error from response', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const createPOStub = sinon.stub(PurchaseOrders, 'create')
            .throws({
              errors: [
                {
                  code: 'COMPANY_REQUIRED',
                  field: 'companyName'
                }
              ]
            })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: '12345678901',
            email: 'abc@gmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isFalse(proceedToPayButton.props('disabled'))
          proceedToPayButton.vm.$emit('click')

          await wrapper.vm.$nextTick()

          assert.isTrue(createPOStub.calledOnce)

          assert.isFalse(proceedToPayButton.props('disabled'))
        })
      })

      describe('Contact Number field', () => {
        it('should disable SAPTP button if contact number is missing', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: '',
            email: 'a@gmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            contactNumber: '12345678901'
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })

        it('should disable SAPTP button if contact number contains characters other than digits', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: 'a$768759',
            email: 'a@gmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            contactNumber: '12345678901'
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })

        it('should disable SAPTP button if contact number doesn\'t contain 11 digits', async () => {
          const store = createStore({
            settingsModule: createMockSettingsModule({
              state: () => ({
                settings: baseSettings
              })
            })
          })
          const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
          const proceedToPayButton = findSaveAndProceedToPayButton(wrapper)

          fillPayerInformationForm(wrapper, {
            company: 'Company A',
            contactNumber: '1234567',
            email: 'a@gmail.com'
          })

          const allBlRows = findAllBlRows(wrapper)

          const firstBlRow = allBlRows.at(0)
          fillBlRow(firstBlRow, { number: 'abcd', amount: '20000', remark: null })

          const secondBlRow = allBlRows.at(1)
          fillBlRow(secondBlRow, { number: 'abcde', amount: '30000', remark: null })

          await wrapper.vm.$nextTick()

          assert.isTrue(proceedToPayButton.props('disabled'))

          fillPayerInformationForm(wrapper, {
            contactNumber: '12345678901'
          })
          await wrapper.vm.$nextTick()
          assert.isFalse(proceedToPayButton.props('disabled'))
        })
      })
    })
  })
})
