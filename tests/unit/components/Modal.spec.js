import { assert } from 'chai'
import sinon from 'sinon'
import { shallowMount } from '@vue/test-utils'
import { createAppLocalVue } from '../utils'
import Modal from '@/components/Modal.vue'

describe('<Modal />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  const localVue = createAppLocalVue()

  it('should not render modal and backdrop initially', () => {
    const wrapper = shallowMount(Modal, { localVue, propsData: { isOpen: false } })
    assert.isFalse(wrapper.find('[data-testid="modal-backdrop"]').exists())
    assert.isFalse(wrapper.find('[data-testid="modal"]').exists())
  })

  it('should render modal if isOpen is true', () => {
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: true },
      slots: {
        default: '<div data-testid="test-slot">Test Slot</div>'
      }
    })

    assert.isTrue(wrapper.find('[data-testid="modal-backdrop"]').isVisible())
    assert.isTrue(wrapper.find('[data-testid="modal"]').isVisible())

    assert.equal(wrapper.find('[data-testid="test-slot"]').text(), 'Test Slot')
  })

  it('should close modal when pressing ESC key', async () => {
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: true, closeOnClickOutside: true }
    })

    const event = new KeyboardEvent('keydown', { keyCode: 27 })
    document.dispatchEvent(event)

    assert.equal(wrapper.emitted('update:isOpen').length, 1)
    assert.equal(wrapper.emitted('update:isOpen')[0][0], false)
  })

  it('should not close when pressing ESC key if closeOnClickOutside is false', async () => {
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: true, closeOnClickOutside: false }
    })

    const event = new KeyboardEvent('keydown', { keyCode: 27 })
    document.dispatchEvent(event)

    assert.isUndefined(wrapper.emitted('update:isOpen'))
  })

  it('should not close modal when pressing Enter key', async () => {
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: true }
    })

    const event = new KeyboardEvent('keydown', { keyCode: 13 })
    document.dispatchEvent(event)

    assert.isUndefined(wrapper.emitted('update:isOpen'))
  })

  it('should close modal when clicking outside', async () => {
    const map = {}
    sinon.stub(document, 'addEventListener').callsFake((event, cb) => {
      map[event] = cb
    })
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: true }
    })

    const backdrop = wrapper.find('[data-testid="modal-backdrop"]')
    map.mousedown({
      target: backdrop.element
    })
    assert.equal(wrapper.emitted('update:isOpen').length, 1)
    assert.equal(wrapper.emitted('update:isOpen')[0][0], false)
  })

  it('should not close when on click outside when prop closeOnClickOutside is false', async () => {
    const map = {}
    sinon.stub(document, 'addEventListener').callsFake((event, cb) => {
      map[event] = cb
    })
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: true, closeOnClickOutside: false }
    })

    const backdrop = wrapper.find('[data-testid="modal-backdrop"]')
    map.mousedown({
      target: backdrop.element
    })
    assert.isUndefined(wrapper.emitted('update:isOpen'))
  })

  it('should not close modal when clicking inside modal', async () => {
    const map = {}
    sinon.stub(document, 'addEventListener').callsFake((event, cb) => {
      map[event] = cb
    })
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: true }
    })

    const dialog = wrapper.find('[data-testid="modal"]')
    map.mousedown({
      target: dialog.element
    })
    assert.isUndefined(wrapper.emitted('update:isOpen'))
  })

  it('should remove event beforeDestroy', () => {
    const mockRemoveEvent = sinon.stub(document, 'removeEventListener')
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: true }
    })

    wrapper.vm.$destroy()
    assert.isTrue(mockRemoveEvent.calledTwice)
    assert.equal(mockRemoveEvent.args[0][0], 'mousedown')
    assert.equal(mockRemoveEvent.args[1][0], 'keydown')
  })

  it('should add padding right to body and fixed elements when open', async () => {
    // Make the body overflows
    sinon.stub(document.body, 'scrollHeight').get(() => 10000)
    const fixedDiv = document.createElement('div')
    fixedDiv.style.position = 'fixed'
    document.body.append(fixedDiv)
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: false }
    })

    wrapper.setProps({
      isOpen: true
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    assert.equal(fixedDiv.style.paddingRight, '0px')
    assert.isTrue(document.body.classList.contains('body__overflowPrevented'))
    assert.equal(document.body.style.paddingRight, '0px')
    fixedDiv.remove()
    document.body.classList.remove('body__overflowPrevented')
  })

  it('should reset padding right of body and fixed elements when closed', async () => {
    // Make the body overflows
    sinon.stub(document.body, 'scrollHeight').get(() => 10000)
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: {
        isOpen: true
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bodyStyleChanged = true
    wrapper.setProps({
      isOpen: false
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    assert.isFalse(document.body.classList.contains('body__overflowPrevented'))
  })

  it('should not change body style when scrollbar is not visible', async () => {
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: { isOpen: false }
    })

    wrapper.setProps({
      isOpen: true
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    assert.isFalse(document.body.classList.contains('body__overflowPrevented'))
  })
})
