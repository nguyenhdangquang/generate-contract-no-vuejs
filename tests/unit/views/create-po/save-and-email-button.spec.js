import { assert } from 'chai'
import sinon from 'sinon'
import * as PurchaseOrders from '@/repositories/PurchaseOrders'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import {
  fillBlRow,
  fillPayerInformationForm,
  findAllBlRows,
  findSaveAndEmailButton
} from './utils'
import { createMockSettingsModule, createStore } from '../../store-utils'
import CreatedPODialog from '@/components/dialog/DialogPOCreated.vue'
import DialogConfirmNavigation from '@/components/dialog/DialogConfirmNavigation.vue'
import CreatePOPage from '@/views/create-po/Index.vue'
import StorageHelper from '@/utils/storageHelper'
import * as createPOMappers from '@/views/create-po/mappers/create-po'
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
  describe('Save and email', () => {
    it('should render save and email button', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      const saveAndEmailButton = findSaveAndEmailButton(wrapper)

      assert.isTrue(saveAndEmailButton.isVisible())
      assert.equal(saveAndEmailButton.text(), 'Save and Email')
    })

    it('should disable save and email button by default', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      const saveAndEmailButton = findSaveAndEmailButton(wrapper)

      assert.isTrue(saveAndEmailButton.props('disabled'))
    })

    it('should enable save and email button if form is valid', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      const saveAndEmailButton = findSaveAndEmailButton(wrapper)

      fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678901' })

      const firstBlRow = findAllBlRows(wrapper).at(0)
      fillBlRow(firstBlRow)

      await wrapper.vm.$nextTick()

      assert.isFalse(saveAndEmailButton.props('disabled'))
    })

    it('should open created PO dialog and display PO Uid when success response from api', async () => {
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
        email: 'a@a.com',
        poUid: 'SG2105093733',
        areaCode: '+65'
      }
      const createPOStub = sinon.stub(PurchaseOrders, 'create')
        .resolves(sampleCreatedPO)

      const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
      const saveAndEmailButton = findSaveAndEmailButton(wrapper)

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

      assert.isFalse(saveAndEmailButton.props('disabled'))
      saveAndEmailButton.vm.$emit('click')

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

      const createdPODialog = wrapper.findComponent(CreatedPODialog)

      assert.isTrue(createdPODialog.props('isOpen'))
      assert.equal(createdPODialog.props('poNumber'), sampleCreatedPO.poUid)
    })

    describe('create new one', () => {
      afterEach(() => {
        sinon.verifyAndRestore()
      })

      it('should clear BL list and kep User information when click create new one', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })
        sinon.stub(PurchaseOrders, 'create').resolves({
          poUid: 'SG123345'
        })
        const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
        const saveAndEmailButton = findSaveAndEmailButton(wrapper)
        const firstBlRow = findAllBlRows(wrapper).at(0)

        fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678' })
        fillBlRow(firstBlRow)

        saveAndEmailButton.vm.$emit('click')
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        const dialog = wrapper.findComponent(CreatedPODialog)
        dialog.vm.$emit('createNewOne')
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        assert.equal(wrapper.vm.$data.companyName, 'Company A')
        assert.equal(wrapper.vm.$data.email, 'test@gmail.com')
        assert.equal(wrapper.vm.$data.contactNumber, '12345678')
        assert.isNull(wrapper.vm.$data.createdPONumber)
        assert.equal(wrapper.vm.$data.blList.length, 5)
        assert.equal(wrapper.vm.$data.totalAmount, 0)
      })
    })

    describe('view details', () => {
      afterEach(() => {
        sinon.verifyAndRestore()
      })

      it('should disable field and kep User information when click view details', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })
        const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
        const saveAndEmailButton = findSaveAndEmailButton(wrapper)
        const firstBlRow = findAllBlRows(wrapper).at(0)

        fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678' })
        fillBlRow(firstBlRow)

        saveAndEmailButton.vm.$emit('click')
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        const dialog = wrapper.findComponent(CreatedPODialog)
        dialog.vm.$emit('viewDetails')
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        assert.equal(wrapper.vm.$data.companyName, 'Company A')
        assert.equal(wrapper.vm.$data.email, 'test@gmail.com')
        assert.equal(wrapper.vm.$data.contactNumber, '12345678')
        assert.equal(wrapper.vm.$data.blList.length, 5)
        assert.equal(wrapper.vm.$data.totalAmount, 10000)
        assert.equal(wrapper.find('[data-testid="blnumber"]').attributes('disabled'), 'disabled')
        assert.equal(wrapper.find('[data-testid="blamount"]').attributes('disabled'), 'disabled')
        assert.equal(wrapper.find('[data-testid="blremark"]').attributes('disabled'), 'disabled')
        assert.isTrue(saveAndEmailButton.props('disabled'))
      })

      it('should remove PO from store when click view details then leave create po page', async () => {
        const store = createStore({
          settingsModule: createMockSettingsModule({
            state: () => ({
              settings: baseSettings
            })
          })
        })

        const wrapper = await shallowMountPage(CreatePOPage, { store, localVue })
        sinon.stub(createPOMappers, 'toCreatePoData').returns({
          companyName: 'sadsadasdad'
        })
        sinon.stub(PurchaseOrders, 'create').resolves({
          poUid: 'SG12313123123'
        })
        sinon.stub(window, 'scrollTo')
        const saveAndEmailButton = findSaveAndEmailButton(wrapper)
        const firstBlRow = findAllBlRows(wrapper).at(0)

        fillPayerInformationForm(wrapper, { company: 'Company A', email: 'test@gmail.com', contactNumber: '12345678' })
        fillBlRow(firstBlRow)

        saveAndEmailButton.vm.$emit('click')
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        const dialog = wrapper.findComponent(CreatedPODialog)
        dialog.vm.$emit('viewDetails')
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        const spiedTriggerRouterGuard = sinon.spy(wrapper.vm, 'triggerRouterGuard')
        wrapper.vm.triggerRouterGuard()
        await wrapper.vm.$nextTick()

        const dialogConfirmNavigation = wrapper.findComponent(DialogConfirmNavigation)
        dialogConfirmNavigation.vm.$emit('confirm')

        assert.isTrue(spiedTriggerRouterGuard.calledOnce)
        assert.isNull(store.getters['purchaseOrder/createdPO'])
      })
    })
  })
})
