import sinon from 'sinon'
import { assert } from 'chai'
import EpPOPaymentRow from '@/components/molecules/EpPOPaymentRow.vue'
import { shallowMount } from '@vue/test-utils'

describe('<EpPOPaymentRowManagement />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render default labels', () => {
    const wrapper = shallowMount(EpPOPaymentRow, {
      propsData: {
        poItem: {}
      }
    })

    assert.equal(wrapper.find('[data-testid="records-label"]').text(), '- - -')
    assert.equal(wrapper.find('[data-testid="amount-label"]').text(), '- - -')
    assert.equal(wrapper.find('[data-testid="company-name-label"]').text(), '- - -')
    assert.equal(wrapper.find('[data-testid="currency-label"]').text(), '')
  })

  it('should render value from props', () => {
    const poItem = {
      amount: '200,000.00',
      currency: 'SGD',
      records: 20,
      companyName: 'Company A',
      error: {
        message: 'Sample error message'
      }
    }
    const wrapper = shallowMount(EpPOPaymentRow, {
      propsData: {
        poItem
      }
    })

    assert.equal(wrapper.find('[data-testid="amount-label"]').text(), poItem.amount)
    assert.equal(wrapper.find('[data-testid="records-label"]').text(), poItem.records)
    assert.equal(wrapper.find('[data-testid="currency-label"]').text(), poItem.currency)
    assert.equal(wrapper.find('[data-testid="company-name-label"]').text(), poItem.companyName)
    assert.equal(wrapper.find('[data-testid="error-message"]').text(), poItem.error.message)
  })

  it('should render input', () => {
    const wrapper = shallowMount(EpPOPaymentRow, {
      propsData: {
        poItem: {
          poNumber: 'SG123123'
        }
      }
    })

    const input = wrapper.find('[aria-label="Po number"]')
    assert.isTrue(input.isVisible())

    assert.equal(input.props('value'), 'SG123123')
  })

  it('should render remove button', () => {
    const wrapper = shallowMount(EpPOPaymentRow, {
      propsData: {
        poItem: {
        }
      }
    })
    const removeButton = wrapper.find('[data-testid="remove-button"]')

    assert.isTrue(removeButton.isVisible())

    removeButton.vm.$emit('click')
    assert.equal(wrapper.emitted('remove').length, 1)
  })

  it('should emit event when changing poNumber', async () => {
    const wrapper = shallowMount(EpPOPaymentRow, {
      propsData: {
        poItem: {
        }
      }
    })

    const input = wrapper.find('[aria-label="Po number"]')
    input.vm.$emit('input', {
      target: {
        value: 'SG12312312'
      }
    })
    await wrapper.vm.$nextTick()

    assert.equal(wrapper.emitted('update:poNumber').length, 1)
    assert.equal(wrapper.emitted('update:poNumber')[0][0], 'SG12312312')
  })

  it('should emit blur event', () => {
    const wrapper = shallowMount(EpPOPaymentRow, {
      propsData: {
        poItem: {
        }
      }
    })

    const input = wrapper.find('[aria-label="Po number"]')
    input.vm.$emit('blur')

    assert.equal(wrapper.emitted('blur').length, 1)
  })
})
