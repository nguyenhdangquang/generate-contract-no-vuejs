import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import EpIconButton from '@/components/EpIconButton.vue'

describe('<EpIconButton />', () => {
  it('should render a button tag', () => {
    const wrapper = shallowMount(EpIconButton, {
      slots: {
        default: 'Test button'
      }
    })

    const button = wrapper.find('button')
    assert.isTrue(button.isVisible())
    assert.equal(button.text(), 'Test button')
  })

  it('should emit click event when clicking button', () => {
    const wrapper = shallowMount(EpIconButton, {
      slots: {
        default: 'Test button'
      }
    })

    const button = wrapper.find('button')
    button.trigger('click')

    assert.equal(wrapper.emitted('click').length, 1)
  })
})
