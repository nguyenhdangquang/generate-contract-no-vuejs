import { assert } from 'chai'
import sinon from 'sinon'
import { shallowMount } from '@vue/test-utils'
import DialogContent from '@/components/dialog/DialogContent.vue'

describe('<DialogContent />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render title', () => {
    const wrapper = shallowMount(DialogContent, {
      propsData: {
        title: 'Test title'
      }
    })

    assert.equal(wrapper.find('[data-testid="title"]').text(), 'Test title')
  })

  it('should render close button', () => {
    const wrapper = shallowMount(DialogContent, {
      propsData: {
        title: 'Test title'
      }
    })

    const closeButton = wrapper.find('[aria-label="Close"]')
    assert.isTrue(closeButton.isVisible())
  })

  it('should render slot', () => {
    const wrapper = shallowMount(DialogContent, {
      propsData: {
        title: 'Test title'
      },
      slots: {
        default: '<div data-testid="test-slot">Test slot</div>'
      }
    })

    assert.isTrue(wrapper.find('[data-testid="test-slot"]').isVisible())
  })

  it('should emit close event when clicking close button', () => {
    const wrapper = shallowMount(DialogContent, {
      propsData: {
        title: 'Test title'
      }
    })

    const closeButton = wrapper.find('[aria-label="Close"]')
    closeButton.vm.$emit('click')

    assert.equal(wrapper.emitted('close').length, 1)
  })
})
