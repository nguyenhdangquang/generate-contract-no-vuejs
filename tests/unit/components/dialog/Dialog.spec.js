import { assert } from 'chai'
import sinon from 'sinon'
import { shallowMount } from '@vue/test-utils'
import { createAppLocalVue } from '../../utils'
import Modal from '@/components/Modal.vue'
import Dialog from '@/components/dialog/Dialog.vue'
import DialogContent from '@/components/dialog/DialogContent.vue'

describe('<Dialog />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  const localVue = createAppLocalVue()

  describe('Modal', () => {
    it('should render Modal component', () => {
      const wrapper = shallowMount(Dialog, { localVue, propsData: { title: 'Test title', isOpen: false } })

      const modal = wrapper.findComponent(Modal)

      assert.equal(modal.props('isOpen'), false)
    })

    it('should forward update:isOpen event from Modal', () => {
      const wrapper = shallowMount(Dialog, { localVue, propsData: { title: 'Test title', isOpen: true } })

      const modal = wrapper.findComponent(Modal)
      modal.vm.$emit('update:isOpen', false)

      assert.equal(wrapper.emitted('update:isOpen').length, 1)
    })
  })

  describe('DialogContent', () => {
    it('should render DialogContent component when modal is open', () => {
      const wrapper = shallowMount(Dialog, {
        localVue,
        propsData: { title: 'Test title', isOpen: true },
        slots: {
          default: '<div data-testid="test-slot">Test slot</div>'
        }
      })

      const dialogContent = wrapper.findComponent(DialogContent)
      assert.isTrue(dialogContent.isVisible())
      assert.equal(dialogContent.props('title'), 'Test title')
      assert.isTrue(wrapper.find('[data-testid="test-slot"]').isVisible())
    })

    it('should forward new event when clicking close button', () => {
      const wrapper = shallowMount(Dialog, {
        localVue,
        propsData: { title: 'Test title', isOpen: true }
      })

      const dialogContent = wrapper.findComponent(DialogContent)
      dialogContent.vm.$emit('close')
      assert.equal(wrapper.emitted('update:isOpen').length, 1)
    })
  })
})
