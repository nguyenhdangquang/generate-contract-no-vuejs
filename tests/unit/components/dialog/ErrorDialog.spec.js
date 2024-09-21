import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import ErrorDialog from '@/components/dialog/ErrorDialog.vue'
import Modal from '@/components/Modal.vue'

describe('<ErrorDialog />', () => {
  it('should render title', () => {
    const title = 'abc'
    const wrapper = shallowMount(ErrorDialog, {
      propsData: { title, isOpen: true }
    })

    assert.equal(wrapper.find('[data-testid="title"]').text(), title)
  })

  it('should render description', () => {
    const description = 'ab112312c'
    const wrapper = shallowMount(ErrorDialog, {
      propsData: { description, isOpen: true }
    })

    assert.equal(wrapper.find('[data-testid="description"]').text(), description)
  })

  it('should render OK button', () => {
    const wrapper = shallowMount(ErrorDialog, {
      propsData: { isOpen: true }
    })

    const okButton = wrapper.find('[class="confirm-button"]')
    assert.isTrue(okButton.isVisible())
  })

  it('should emit close event when clicking Ok button', () => {
    const wrapper = shallowMount(ErrorDialog, {
      propsData: { isOpen: true }
    })

    const okButton = wrapper.find('[class="confirm-button"]')
    okButton.vm.$emit('click')

    assert.equal(wrapper.emitted('update:isOpen')[0][0], false)
  })

  it('should emit update:isOpen event', () => {
    const wrapper = shallowMount(ErrorDialog, {
      propsData: { isOpen: true }
    })

    const modalComponent = wrapper.findComponent(Modal)
    modalComponent.vm.$emit('update:isOpen', false)

    assert.equal(wrapper.emitted('update:isOpen').length, 1)
  })
})
