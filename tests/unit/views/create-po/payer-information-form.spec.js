import sinon from 'sinon'
import { createMockSettingsModule, createStore } from '../../store-utils'
import IndexPage from '@/views/create-po/Index.vue'
import PayerInformationForm from '@/views/create-po/components/PayerInformationForm.vue'
import { createAppLocalVue } from '../../utils'
import { shallowMount } from '@vue/test-utils'
import { assert } from 'chai'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import * as companyNameValidators from '@/views/create-po/services/validateCompanyName'
import * as emailValidators from '@/views/create-po/services/validateEmail'
import * as contactNumberValidators from '@/views/create-po/services/validateContactNumber'
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

describe('Index.vue: <PayerInformationForm />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should render PayerInformationForm', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(IndexPage, { store, localVue })

    assert.isTrue(wrapper.findComponent(PayerInformationForm).isVisible())
  })

  describe('Company Name', () => {
    it('should update company name', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })

      const payerInformationForm = wrapper.findComponent(PayerInformationForm)
      payerInformationForm.vm.$emit('update:companyName', 'Company A')

      assert.equal(wrapper.vm.$data.companyName, 'Company A')
      await wrapper.vm.$nextTick()
      assert.isTrue(wrapper.vm.$data.hasChangedData)
    })

    it('should validate company name on blur', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })

      const payerInformationForm = wrapper.findComponent(PayerInformationForm)
      payerInformationForm.vm.$emit('companyNameBlur')

      assert.equal(wrapper.vm.$data.msg.companyNameError, ErrorMessage.COMPANY_REQUIRED)
      assert.deepEqual(payerInformationForm.props('errors'), {
        companyNameError: ErrorMessage.COMPANY_REQUIRED,
        emailError: '',
        contactNumberError: ''
      })
      assert.equal(wrapper.vm.$data.hasChangedData, true)
    })

    it('should trigger validation on blur', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })
      const payerInformationForm = wrapper.findComponent(PayerInformationForm)

      const stubValidateCompanyName = sinon
        .stub(companyNameValidators, 'validateCompanyName')
        .returns(ErrorMessage.COMPANY_REQUIRED)

      payerInformationForm.vm.$emit('update:companyName', 'Company Name')
      payerInformationForm.vm.$emit('companyNameBlur')

      assert.isTrue(stubValidateCompanyName.calledOnce)
      assert.equal(stubValidateCompanyName.args[0][0], 'Company Name')
    })

    it('should show error message if failed validation', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })
      const payerInformationForm = wrapper.findComponent(PayerInformationForm)

      sinon
        .stub(companyNameValidators, 'validateCompanyName')
        .returns(ErrorMessage.COMPANY_REQUIRED)

      payerInformationForm.vm.$emit('update:companyName', '')
      payerInformationForm.vm.$emit('companyNameBlur')

      assert.deepEqual(payerInformationForm.props('errors'), {
        companyNameError: ErrorMessage.COMPANY_REQUIRED,
        emailError: '',
        contactNumberError: ''
      })
    })

    it('should show error message if failed validation - contains white space only', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })
      const payerInformationForm = wrapper.findComponent(PayerInformationForm)

      sinon
        .stub(companyNameValidators, 'validateCompanyName')
        .returns(ErrorMessage.COMPANY_REQUIRED)

      payerInformationForm.vm.$emit('update:companyName', '     ')
      payerInformationForm.vm.$emit('companyNameBlur')

      assert.deepEqual(payerInformationForm.props('errors'), {
        companyNameError: ErrorMessage.COMPANY_REQUIRED,
        emailError: '',
        contactNumberError: ''
      })
    })
  })

  describe('Email', () => {
    it('should update email', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })

      const payerInformationForm = wrapper.findComponent(PayerInformationForm)
      payerInformationForm.vm.$emit('update:email', 'test@gmail.com')

      assert.equal(wrapper.vm.$data.email, 'test@gmail.com')
      await wrapper.vm.$nextTick()
      assert.isTrue(wrapper.vm.$data.hasChangedData)
    })

    it('should validate email on blur', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })

      const payerInformationForm = wrapper.findComponent(PayerInformationForm)
      payerInformationForm.vm.$emit('emailBlur')

      assert.equal(wrapper.vm.$data.msg.emailError, ErrorMessage.EMAIL_REQUIRED)
      assert.deepEqual(payerInformationForm.props('errors'), {
        companyNameError: '',
        emailError: ErrorMessage.EMAIL_REQUIRED,
        contactNumberError: ''
      })
      assert.equal(wrapper.vm.$data.hasChangedData, true)
    })

    it('should trigger validation on blur', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })
      const payerInformationForm = wrapper.findComponent(PayerInformationForm)

      const stubValidateEmail = sinon
        .stub(emailValidators, 'validateEmail')
        .returns(ErrorMessage.EMAIL_REQUIRED)

      payerInformationForm.vm.$emit('update:email', 'test@gmail.com')
      payerInformationForm.vm.$emit('emailBlur')

      assert.isTrue(stubValidateEmail.calledOnce)
      assert.equal(stubValidateEmail.args[0][0], 'test@gmail.com')
    })

    it('should show error message if failed validation', async () => {
      const store = createStore({
        settingsModule: createMockSettingsModule({
          state: () => ({
            settings: baseSettings
          })
        })
      })
      const wrapper = shallowMount(IndexPage, { store, localVue })
      const payerInformationForm = wrapper.findComponent(PayerInformationForm)

      sinon
        .stub(emailValidators, 'validateEmail')
        .returns(ErrorMessage.EMAIL_REQUIRED)

      payerInformationForm.vm.$emit('update:email', '')
      payerInformationForm.vm.$emit('emailBlur')

      assert.deepEqual(payerInformationForm.props('errors'), {
        companyNameError: '',
        emailError: ErrorMessage.EMAIL_REQUIRED,
        contactNumberError: ''
      })
    })
  })

  it('should show error message if failed validation - contains only white space', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(IndexPage, { store, localVue })
    const payerInformationForm = wrapper.findComponent(PayerInformationForm)

    sinon
      .stub(emailValidators, 'validateEmail')
      .returns(ErrorMessage.EMAIL_REQUIRED)

    payerInformationForm.vm.$emit('update:email', '    ')
    payerInformationForm.vm.$emit('emailBlur')

    assert.deepEqual(payerInformationForm.props('errors'), {
      companyNameError: '',
      emailError: ErrorMessage.EMAIL_REQUIRED,
      contactNumberError: ''
    })
  })
})

describe('Contact Number', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })
  it('should update contact number', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(IndexPage, { store, localVue })

    const payerInformationForm = wrapper.findComponent(PayerInformationForm)
    payerInformationForm.vm.$emit('update:contactNumber', '11111111')

    assert.equal(wrapper.vm.$data.contactNumber, '11111111')
    await wrapper.vm.$nextTick()
    assert.isTrue(wrapper.vm.$data.hasChangedData)
  })

  it('should validate contact number on blur', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(IndexPage, { store, localVue })

    const payerInformationForm = wrapper.findComponent(PayerInformationForm)
    payerInformationForm.vm.$emit('contactNumberBlur')

    assert.deepEqual(wrapper.vm.$data.msg, {
      companyNameError: '',
      emailError: '',
      contactNumberError: ErrorMessage.CONTACT_REQUIRED
    })
    assert.equal(wrapper.vm.$data.hasChangedData, true)
  })

  it('should only allow inputting number', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(IndexPage, { store, localVue })
    const payerInformationForm = wrapper.findComponent(PayerInformationForm)

    const mockPreventDefault = sinon.stub()
    const event = {
      which: 65, // 'a'
      preventDefault: mockPreventDefault
    }

    payerInformationForm.vm.$emit('contactNumberKeypress', event)
    assert.isTrue(mockPreventDefault.calledOnce)
  })

  it('should trigger validation on blur', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(IndexPage, { store, localVue })
    const payerInformationForm = wrapper.findComponent(PayerInformationForm)

    const stubValidateContactNumber = sinon
      .stub(contactNumberValidators, 'validateContactNumber')
      .returns(ErrorMessage.CONTACT_REQUIRED)

    payerInformationForm.vm.$emit('update:contactNumber', '11111111')
    payerInformationForm.vm.$emit('contactNumberBlur')

    assert.isTrue(stubValidateContactNumber.calledOnce)
    assert.equal(stubValidateContactNumber.args[0][0], '11111111')
  })

  it('should show error message if failed validation', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(IndexPage, { store, localVue })
    const payerInformationForm = wrapper.findComponent(PayerInformationForm)

    sinon
      .stub(contactNumberValidators, 'validateContactNumber')
      .returns(ErrorMessage.CONTACT_REQUIRED)

    payerInformationForm.vm.$emit('update:contactNumber', '')
    payerInformationForm.vm.$emit('contactNumberBlur')

    assert.deepEqual(payerInformationForm.props('errors'), {
      companyNameError: '',
      emailError: '',
      contactNumberError: ErrorMessage.CONTACT_REQUIRED
    })
  })

  it('should trigger switch country', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = shallowMount(IndexPage, { store, localVue })
    const payerInformationForm = wrapper.findComponent(PayerInformationForm)
    payerInformationForm.vm.$emit('switchCountryContact')
  })
})
