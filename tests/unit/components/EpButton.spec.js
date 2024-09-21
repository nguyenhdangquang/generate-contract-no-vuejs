import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import EpSpinner from '@/components/EpSpinner.vue'
import EpButton from '@/components/EpButton.vue'
import TickIcon from '@/components/icons/TickIcon.vue'

describe('<EpButton />', () => {
  it('should render a button', () => {
    const wrapper = shallowMount(EpButton, {
      slots: {
        default: 'Test button'
      }
    })

    const button = wrapper.find('button')
    assert.equal(button.text(), 'Test button')

    assert.isTrue(button.classes().includes('ep-btn'))
    assert.isTrue(button.classes().includes('btn'))
  })

  it('should render primary filled button as default', () => {
    const wrapper = shallowMount(EpButton, {
      slots: {
        default: 'Test button'
      }
    })

    const button = wrapper.find('button')

    assert.isTrue(button.classes().includes('ep-btn--filled'))
    assert.isTrue(button.classes().includes('ep-btn--primary'))
  })

  it('should render outlined button', () => {
    const wrapper = shallowMount(EpButton, {
      slots: {
        default: 'Test button'
      },
      propsData: {
        variant: 'outlined'
      }
    })

    const button = wrapper.find('button')
    assert.isTrue(button.classes().includes('ep-btn--outlined'))
  })

  it('should render success color button', () => {
    const wrapper = shallowMount(EpButton, {
      slots: {
        default: 'Test button'
      },
      propsData: {
        color: 'success'
      }
    })

    const button = wrapper.find('button')
    assert.isTrue(button.classes().includes('ep-btn--success'))
  })

  it('should render a loading state button', () => {
    const wrapper = shallowMount(EpButton, {
      slots: {
        default: 'Test button'
      },
      propsData: {
        state: 'loading'
      }
    })

    assert.isTrue(wrapper.findComponent(EpSpinner).isVisible())
  })

  it('should render a success state button', () => {
    const wrapper = shallowMount(EpButton, {
      slots: {
        default: 'Test button'
      },
      propsData: {
        state: 'success'
      }
    })

    assert.isTrue(wrapper.findComponent(TickIcon).isVisible())
  })

  it('should emit click event when clicking button', () => {
    const wrapper = shallowMount(EpButton, {
      slots: {
        default: 'Test button'
      }
    })

    const button = wrapper.find('button')
    button.trigger('click')

    assert.equal(wrapper.emitted('click').length, 1)
  })
})
