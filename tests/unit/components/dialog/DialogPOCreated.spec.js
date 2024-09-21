import { assert } from 'chai'
import sinon from 'sinon'
import { shallowMount } from '@vue/test-utils'
import EpButton from '@/components/EpButton.vue'
import DialogPOCreated from '@/components/dialog/DialogPOCreated.vue'

describe('<DialogPOCreated />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render poNumber', () => {
    const wrapper = shallowMount(DialogPOCreated, {
      propsData: {
        isOpen: true,
        poNumber: 'SG2021123456',
        countryCode: 'sg'
      }
    })
    assert.equal(wrapper.find('[data-testid="poNumber"]').text(), 'SG2021123456')
  })

  it('should emitted createNewOne', () => {
    const wrapper = shallowMount(DialogPOCreated, {
      propsData: {
        isOpen: true,
        poNumber: 'SG2021123456',
        countryCode: 'sg'
      }
    })
    const button = wrapper.findAllComponents(EpButton).at(0)
    button.vm.$emit('click')
    assert.equal(wrapper.find('[data-testid="poNumber"]').text(), 'SG2021123456')
    assert.equal(wrapper.emitted('createNewOne').length, 1)
  })

  it('should emitted viewDetails', () => {
    const wrapper = shallowMount(DialogPOCreated, {
      propsData: {
        isOpen: true,
        poNumber: 'SG2021123456',
        countryCode: 'sg'
      }
    })
    const button = wrapper.findAllComponents(EpButton).at(1)
    button.vm.$emit('click')
    assert.equal(wrapper.find('[data-testid="poNumber"]').text(), 'SG2021123456')
    assert.equal(wrapper.emitted('viewDetails').length, 1)
  })
})
