import { shallowMount } from '@vue/test-utils'
import { assert } from 'chai'
import sinon from 'sinon'
import PayerInformationForm from '@/views/create-po/components/PayerInformationForm.vue'

describe('<PayerInformationForm />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render form', () => {
    const wrapper = shallowMount(PayerInformationForm, {
      propsData: {
        countryCode: 'sg'
      }
    })

    assert.isTrue(wrapper.find('#company-name-input').isVisible())
    assert.isTrue(wrapper.find('#email-input').isVisible())
    assert.isTrue(wrapper.find('#contact-number-input').isVisible())
  })

  it('should emit event when changing company name', () => {
    const wrapper = shallowMount(PayerInformationForm, {
      propsData: {
        countryCode: 'sg'
      }
    })

    const companyNameInput = wrapper.find('#company-name-input')
    companyNameInput.element.value = 'Company A'
    companyNameInput.trigger('input')

    assert.equal(wrapper.emitted('update:companyName').length, 1)
    assert.equal(wrapper.emitted('update:companyName')[0][0], 'Company A')
  })

  it('should emit event when changing email', () => {
    const wrapper = shallowMount(PayerInformationForm, {
      propsData: {
        countryCode: 'sg'
      }
    })

    const emailInput = wrapper.find('#email-input')
    emailInput.element.value = 'test@gmail.com'
    emailInput.trigger('input')

    assert.equal(wrapper.emitted('update:email').length, 1)
    assert.equal(wrapper.emitted('update:email')[0][0], 'test@gmail.com')
  })

  it('should emit event when changing contact number', () => {
    const wrapper = shallowMount(PayerInformationForm, {
      propsData: {
        countryCode: 'sg'
      }
    })

    const contactNumberInput = wrapper.find('#contact-number-input')
    contactNumberInput.element.value = '11111111'
    contactNumberInput.trigger('input')

    assert.equal(wrapper.emitted('update:contactNumber').length, 1)
    assert.equal(wrapper.emitted('update:contactNumber')[0][0], '11111111')
  })

  it('fill data to form from props', () => {
    const wrapper = shallowMount(PayerInformationForm, {
      propsData: {
        companyName: 'Company A',
        email: 'test@gmail.com',
        contactNumber: '12345678',
        countryCode: 'sg'
      }
    })

    assert.equal(wrapper.find('#company-name-input').element.value, 'Company A')
    assert.equal(wrapper.find('#email-input').element.value, 'test@gmail.com')
    assert.equal(wrapper.find('#contact-number-input').element.value, '12345678')
  })

  it('should emit blur events', () => {
    const wrapper = shallowMount(PayerInformationForm, {
      propsData: {
        countryCode: 'sg'
      }
    })

    wrapper.find('#company-name-input').trigger('blur')
    assert.equal(wrapper.emitted('companyNameBlur').length, 1)

    wrapper.find('#email-input').trigger('blur')
    assert.equal(wrapper.emitted('emailBlur').length, 1)

    wrapper.find('#contact-number-input').trigger('blur')
    assert.equal(wrapper.emitted('contactNumberBlur').length, 1)
  })

  it('should emit contact number input keypress event', () => {
    const wrapper = shallowMount(PayerInformationForm, {
      propsData: {
        countryCode: 'sg'
      }
    })
    wrapper.find('#contact-number-input').trigger('keypress')

    assert.equal(wrapper.emitted('contactNumberKeypress').length, 1)
  })

  it('should render errors from props', async () => {
    const wrapper = shallowMount(PayerInformationForm, {
      propsData: {
        countryCode: 'sg',
        errors: {
          contactNumberError: 'Contact number error',
          emailError: 'Email error',
          companyNameError: 'Company name error'
        }
      }
    })
    await wrapper.vm.$nextTick()

    assert.equal(wrapper.find('[data-testid="company-name-error"]').text(), 'Company name error')
    assert.equal(wrapper.find('[data-testid="email-error"]').text(), 'Email error')
    assert.equal(wrapper.find('[data-testid="contact-number-error"]').text(), 'Contact number error')
  })
})
