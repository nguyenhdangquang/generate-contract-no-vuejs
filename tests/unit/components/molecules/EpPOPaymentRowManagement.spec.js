import sinon from 'sinon'
import { assert } from 'chai'
import EpIconButton from '@/components/EpIconButton.vue'
import EpLabel from '@/components/atoms/EpLabel.vue'
import EpPOPaymentRowManagement from '@/components/molecules/EpPOPaymentRowManagement.vue'
import { shallowMount } from '@vue/test-utils'

describe('<EpPOPaymentRowManagement />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render label', () => {
    const blsCount = 20
    const maxBls = 450
    const wrapper = shallowMount(EpPOPaymentRowManagement, {
      propsData: {
        blsCount,
        maxBls,
        posCount: 0,
        maxPos: 100,
        countryCode: 'SG'
      }
    })

    assert.equal(wrapper.findComponent(EpLabel).text(), 'Total')
  })

  it('should render rowsCount and limitRecords', () => {
    const blsCount = 20
    const maxBls = 450
    const wrapper = shallowMount(EpPOPaymentRowManagement, {
      propsData: {
        blsCount,
        maxBls,
        posCount: 0,
        maxPos: 100,
        countryCode: 'SG'
      }
    })

    assert.equal(wrapper.find('[data-testid="total-rows-text"]').text(), `${blsCount} / ${maxBls}`)
  })

  it('should render add icon', () => {
    const blsCount = 20
    const maxBls = 450
    const wrapper = shallowMount(EpPOPaymentRowManagement, {
      propsData: {
        blsCount,
        maxBls,
        posCount: 0,
        maxPos: 100,
        countryCode: 'SG'
      }
    })
    const button = wrapper.findComponent(EpIconButton)

    assert.isTrue(button.isVisible())
  })

  it('should emit add event when clicking add button', () => {
    const blsCount = 20
    const maxBls = 450
    const wrapper = shallowMount(EpPOPaymentRowManagement, {
      propsData: {
        blsCount,
        maxBls,
        posCount: 0,
        maxPos: 100,
        countryCode: 'SG'
      }
    })
    const button = wrapper.findComponent(EpIconButton)
    button.vm.$emit('click')

    assert.equal(wrapper.emitted('add').length, 1)
  })

  it('should disable add button when exceed limit number of bls', () => {
    const blsCount = 451
    const maxBls = 450
    const wrapper = shallowMount(EpPOPaymentRowManagement, {
      propsData: {
        blsCount,
        maxBls,
        posCount: 0,
        maxPos: 100,
        countryCode: 'SG'
      }
    })

    const button = wrapper.findComponent(EpIconButton)
    assert.equal(button.attributes('disabled'), 'true')
  })

  it('should disable add button when reached limit number of bls', () => {
    const blsCount = 450
    const maxBls = 450
    const wrapper = shallowMount(EpPOPaymentRowManagement, {
      propsData: {
        blsCount,
        maxBls,
        posCount: 0,
        maxPos: 100,
        countryCode: 'SG'
      }
    })

    const button = wrapper.findComponent(EpIconButton)
    assert.equal(button.attributes('disabled'), 'true')
  })

  it('should disable add button when reached limit number of pos', () => {
    const blsCount = 20
    const maxBls = 450
    const wrapper = shallowMount(EpPOPaymentRowManagement, {
      propsData: {
        blsCount,
        maxBls,
        posCount: 100,
        maxPos: 100,
        countryCode: 'SG'
      }
    })

    const button = wrapper.findComponent(EpIconButton)
    assert.equal(button.attributes('disabled'), 'true')
  })
})
