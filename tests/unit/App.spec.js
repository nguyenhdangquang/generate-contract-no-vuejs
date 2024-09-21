import { assert } from 'chai'
import sinon from 'sinon'
import StorageHelper from '@/utils/storageHelper'
import App from '@/App.vue'
import ErrorDialog from '@/components/dialog/ErrorDialog.vue'
import { shallowMountPage, createAppLocalVue } from './utils'
import { createStore, createMockApplicationModule } from './store-utils'

const localVue = createAppLocalVue()
describe('<App.vue />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
    sinon.stub(window, 'scrollTo')
  })

  describe('<ErrorDialog />', () => {
    it('render ErrorDialog Component', async () => {
      const store = createStore({
        applicationModule: createMockApplicationModule({
          state: () => ({
            error: 'error mocking'
          })
        })
      })
      const wrapper = await shallowMountPage(
        App,
        {
          localVue,
          store
        })
      await wrapper.vm.$nextTick()
      assert.isTrue(wrapper.findComponent(ErrorDialog).exists())
    })

    it('trigger handle clear error at ErrorDialog Component', async () => {
      const applicationclearErrorStub = sinon.stub()
      const store = createStore({
        applicationModule: createMockApplicationModule({
          state: () => ({
            error: 'error mocking'
          }),
          actions: {
            clearError: applicationclearErrorStub
          }
        })
      })
      const wrapper = await shallowMountPage(
        App,
        {
          localVue,
          store
        })
      await wrapper.vm.$nextTick()
      const ErrorDialogComponent = wrapper.findComponent(ErrorDialog)
      ErrorDialogComponent.vm.$emit('update:isOpen', false)
      assert.isTrue(applicationclearErrorStub.calledOnce)
    })
  })
})
