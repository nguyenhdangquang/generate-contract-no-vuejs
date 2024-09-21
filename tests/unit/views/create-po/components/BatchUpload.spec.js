import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon'
import Dialog from '@/components/dialog/Dialog.vue'
import BatchUpload from '@/views/create-po/components/BatchUpload.vue'
import * as fileValidator from '@/views/create-po/services/batch-upload/fileValidate'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import { createStore } from '../../../store-utils'
import { createAppLocalVue } from '../../../utils'

const localVue = createAppLocalVue()

describe('BatchUpload.vue', () => {
  afterEach(() => { sinon.verifyAndRestore() })

  it('should hide dialog by default', async () => {
    const wrapper = shallowMount(BatchUpload)
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent(Dialog)
    assert.equal(dialog.props('isOpen'), false)
  })

  it('should open dialog when clicking BatchUpload button', async () => {
    const wrapper = shallowMount(BatchUpload)
    await wrapper.vm.$nextTick()

    const batchUploadButton = wrapper.find('[data-testid="batch-upload-button"]')
    const dialog = wrapper.findComponent(Dialog)
    assert.isTrue(batchUploadButton.isVisible())

    batchUploadButton.trigger('click')
    await wrapper.vm.$nextTick()
    assert.isTrue(dialog.props('isOpen'))
  })

  it('should reset data when close dialog', async () => {
    const wrapper = shallowMount(BatchUpload, {
      data: () => ({
        isModalOpen: true,
        fileName: 'Test.xlsx',
        error: 'Wrong title',
        blList: [{ title: 'file01' }]
      })
    })

    const dialog = wrapper.findComponent(Dialog)
    assert.isTrue(dialog.props('isOpen'))

    dialog.vm.$emit('update:isOpen', false)
    await wrapper.vm.$nextTick()

    assert.isNull(wrapper.vm.$data.fileName)
    assert.isNull(wrapper.vm.$data.error)
    assert.deepEqual(wrapper.vm.$data.blList, [])
  })

  it('should show error state when uploaded file is invalid', async () => {
    const wrapper = shallowMount(BatchUpload)

    wrapper.vm.$data.error = 'Unable to upload file'
    wrapper.vm.$data.state = 'error'
    await wrapper.vm.$nextTick()

    assert.equal(wrapper.find('[data-testid="alert"]').text(), 'Unable to upload file')
    assert.equal(wrapper.find('[data-testid="select-file-button"]').text(), 'Select File')
  })

  it('should show valid state upload file successfully', async () => {
    const wrapper = shallowMount(BatchUpload)

    wrapper.vm.$data.fileName = 'test.xls'
    wrapper.vm.$data.error = undefined
    await wrapper.vm.$nextTick()

    assert.equal(wrapper.find('[data-testid="select-file-button"]').props('state'), 'success')
  })

  it('should render batch upload button', () => {
    const wrapper = shallowMount(BatchUpload)

    assert.isTrue(wrapper.find('button').isVisible())
    assert.equal(wrapper.find('button').text(), 'Batch Upload')
  })

  it('should render title', () => {
    const wrapper = shallowMount(BatchUpload)

    const dialog = wrapper.findComponent(Dialog)
    assert.equal(dialog.props('title'), 'Excel Upload (B/L or Invoice)')
  })

  it('should render description text', () => {
    const wrapper = shallowMount(BatchUpload)

    assert.equal(wrapper.find('[data-testid="choose-file-text"]').text(), 'Choose a file you want to upload')
    assert.equal(wrapper.find('[data-testid="maximum-file-size-text"]').text(), 'Maximum file size: 300KB')
    assert.equal(wrapper.find('[data-testid="file-format-text"]').text(), 'File format: XLSX or XLS')
  })

  it('should render select file button and input', () => {
    const wrapper = shallowMount(BatchUpload)
    const batchUploadButton = wrapper.find('[data-testid="batch-upload-button"]')
    batchUploadButton.trigger('click')

    assert.isTrue(wrapper.find('[data-testid="select-file-button"]').isVisible())
    assert.isTrue(wrapper.find('[data-testid="select-file-input"]').isVisible())
  })

  it('should render batch upload button', () => {
    const wrapper = shallowMount(BatchUpload)
    const batchUploadButton = wrapper.find('[data-testid="batch-upload-button"]')

    assert.equal(batchUploadButton.text(), 'Batch Upload')
  })

  it('should render overwritten alert', () => {
    const wrapper = shallowMount(BatchUpload)
    const batchUploadButton = wrapper.find('[data-testid="batch-upload-button"]')
    batchUploadButton.trigger('click')

    assert.isTrue(wrapper.find('[data-testid="overwritten-alert"]').isVisible())
    assert.equal(wrapper.find('[data-testid="overwritten-alert"]').text(), 'Your data inputted will be overwritten')
  })

  it('should trigger file input when clicking button', async () => {
    const wrapper = shallowMount(BatchUpload)
    const fileInputClickStub = sinon.stub(wrapper.vm.$refs.fileInput, 'click')

    const selectFileButton = wrapper.find('[data-testid="select-file-button"]')
    selectFileButton.vm.$emit('click')

    assert.isTrue(fileInputClickStub.calledOnce)
  })

  it('should remove event beforeDestroy', () => {
    const mockRemoveEvent = sinon.stub(document, 'removeEventListener')
    const store = createStore()
    const wrapper = shallowMount(BatchUpload, {
      localVue,
      store,
      computed: {
        country: () => ({
          defaultCurrency: {
            code: 'SGD'
          }
        })
      }
    })

    wrapper.vm.$destroy()
    assert.isTrue(mockRemoveEvent.calledOnce)
    assert.equal(mockRemoveEvent.args[0][0], 'click')
  })

  describe('Upload file', () => {
    it('should show fileName', async () => {
      const wrapper = shallowMount(BatchUpload)
      const fileInput = wrapper.find('[data-testid="select-file-input"]')
      const stubTakeFile = sinon.stub(wrapper.vm, 'takeFile').returns({
        name: 'Sample file name'
      })

      fileInput.trigger('change')
      await wrapper.vm.$nextTick()

      assert.isTrue(stubTakeFile.calledOnce)

      const fileNameText = wrapper.find('[data-testid="filename-text"]')
      assert.equal(fileNameText.text(), 'Sample file name')
    })

    it('should display error when file is invalid', async () => {
      const wrapper = shallowMount(BatchUpload)
      const fileInput = wrapper.find('[data-testid="select-file-input"]')
      sinon.stub(wrapper.vm, 'takeFile').returns({
        name: 'Sample file name'
      })

      const stubValidateExcelFile = sinon.stub(fileValidator, 'validateExcelFile')
        .throws(new Error(ErrorMessage.EXCEL_FILE_DOES_NOT_SUPPORT))

      fileInput.trigger('change')
      await wrapper.vm.$nextTick()

      assert.isTrue(stubValidateExcelFile.calledOnce)
      assert.equal(wrapper.find('[data-testid="alert"]').text(), ErrorMessage.EXCEL_FILE_DOES_NOT_SUPPORT)

      // Should trigger file upload again when in error state
      const fileInputClickStub = sinon.stub(wrapper.vm.$refs.fileInput, 'click')

      const selectFileButton = wrapper.find('[data-testid="select-file-button"]')
      selectFileButton.vm.$emit('click')

      assert.isTrue(fileInputClickStub.calledOnce)
    })

    it('should display valid state when file is valid', async () => {
      const store = createStore()
      const wrapper = shallowMount(BatchUpload, {
        localVue,
        store,
        computed: {
          country: () => ({
            defaultCurrency: {
              code: 'SGD'
            }
          })
        }
      })

      const fileInput = wrapper.find('[data-testid="select-file-input"]')
      sinon.stub(wrapper.vm, 'takeFile').returns({
        name: 'Sample file name'
      })

      const mockBlList = [{ number: '123123' }]
      const stubValidateExcelFile = sinon.stub(fileValidator, 'validateExcelFile')
      const stubReadFileToWorkbook = sinon.stub(fileValidator, 'readFileToWorkbook')
        .resolves(undefined)
      const stubValidateExcelContent = sinon.stub(fileValidator, 'validateExcelContent')
        .returns({
          data: mockBlList
        })

      fileInput.trigger('change')
      await wrapper.vm.$nextTick()

      assert.isTrue(stubValidateExcelFile.calledOnce)
      assert.isTrue(stubReadFileToWorkbook.calledOnce)
      assert.isTrue(stubValidateExcelContent.calledOnce)

      // Select file button should have "success" state
      const selectFileButton = wrapper.find('[data-testid="select-file-button"]')
      assert.equal(selectFileButton.props('state'), 'success')

      // Should emit "bl_list_update" when clicking selectFileButton again
      selectFileButton.vm.$emit('click')

      assert.equal(wrapper.emitted('bl_list_update').length, 1)
      assert.deepEqual(wrapper.emitted('bl_list_update')[0][0], mockBlList)
    })

    it('should always take the first file', () => {
      const wrapper = shallowMount(BatchUpload)

      assert.deepEqual(wrapper.vm.takeFile(
        {
          target: {
            files: [{ name: 'file001' }, { name: 'file002' }]
          }
        }
      ), { name: 'file001' })
    })
  })
})
