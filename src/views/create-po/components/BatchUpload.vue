<template lang="html">
  <div>
    <button
      type="button"
      class="btn p-8-12 btn__up-down btn--sm-scr btn-modal-upload"
      @click="handleBatchUploadButtonClick"
      data-testid="batch-upload-button"
      :disabled="isDisable"
    >
      <img src="/img/upload.svg" class="mr-8" alt="upload"/>
      Batch Upload
    </button>

    <Dialog
      :isOpen.sync="isModalOpen"
      :title="getDisplayText('payPoPage_payPO_componentBatchUpload_modalTitle')"
    >
      <ep-alert data-testid="alert" v-if="error">
        {{ error }}
      </ep-alert>

      <div class="d-flex flex-column align-items-center mt-5">

        <div v-if="fileName" class="d-flex align-items-center">
          <img data-testid="file-icon" class="mr-2" src="/img/copy.svg" alt="File" />

          <div data-testid="filename-text">{{ fileName }}</div>
        </div>

        <h4 v-else data-testid="choose-file-text" class="font-weight-bold">Choose a file you want to upload</h4>

        <div class="mt-4">
          <ep-button
            :state="state === 'error' ? 'default' : state"
            class="select-file-button"
            data-testid="select-file-button"
            @click="handleFileButtonClick"
          >
          Select File
          </ep-button>

          <input
            ref="fileInput"
            class="d-none"
            type="file"
            accept=".xlsx, .xls"
            @change="handleFileSelect"
            data-testid="select-file-input"
          />
        </div>

        <div class="mt-3" data-testid="maximum-file-size-text">Maximum file size: 300KB</div>
        <div data-testid="file-format-text">File format: XLSX or XLS</div>

        <div data-testid="overwritten-alert" class="overwritten-alert">
          <error-icon />
          Your data inputted will be overwritten
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import EpButton from '@/components/EpButton.vue'
import EpAlert from '@/components/EpAlert.vue'
import Dialog from '@/components/dialog/Dialog.vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'
import { mapGetters } from 'vuex'
import * as fileValidator from '@/views/create-po/services/batch-upload/fileValidate'
import { getTextByCountry } from '@/utils/displayTextResources'

export default {
  components: {
    EpButton,
    EpAlert,
    ErrorIcon,
    Dialog
  },

  data () {
    return {
      error: null,
      fileName: null,
      blList: [],
      isModalOpen: false
    }
  },

  props: {
    isDisable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      country: 'settings/country'
    }),

    state () {
      if (!this.fileName) {
        return 'default'
      }

      if (this.error) {
        return 'error'
      }

      return 'success'
    }
  },

  watch: {
    isModalOpen: {
      handler (isModalOpen) {
        if (!isModalOpen) {
          this.resetData()
        }
      }
    }
  },

  mounted () {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeDestroy () {
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    takeFile (event) {
      return event.target.files[0]
    },

    handleFileButtonClick () {
      switch (this.state) {
        case 'default':
        case 'error': {
          this.$refs.fileInput.click()
          break
        }
        case 'success': {
          this.$emit('bl_list_update', this.blList)
          this.blList = []
          this.closeModal()
          break
        }
      }
    },

    resetData () {
      this.fileName = null
      this.error = null
      this.blList = []
    },

    resetError () {
      this.error = null
    },

    showModal () {
      this.isModalOpen = true
    },

    closeModal () {
      this.isModalOpen = false
    },

    handleBatchUploadButtonClick () {
      this.showModal()
    },

    async handleFileSelect (event) {
      const file = this.takeFile(event)
      if (file) {
        // Reset the input so that user can upload the same file again.
        event.target.value = ''

        // Reset all errors before validating
        this.resetError()

        this.fileName = file.name

        try {
          fileValidator.validateExcelFile(file)
          const workbook = await fileValidator.readFileToWorkbook(file)
          const result = fileValidator
            .validateExcelContent(workbook, this.country.defaultCurrency.code, this.country.code)
          this.blList = result.data
        } catch (error) {
          this.error = error.message
        }
      }
    },
    getDisplayText (text, params = []) {
      const countryURL = window.location.pathname ? window.location.pathname.slice(1, 3).toUpperCase() : 'SG'
      return getTextByCountry(countryURL, text, params)
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload-batch-modal-dialog {
    width: 1074px;
    margin: auto;
  }

  .select-file-button {
    width: 178px;
  }

  .overwritten-alert {
    background-color: rgba(246, 170, 28, 0.3);
    display: flex;
    padding: 0.625rem;
    align-items: center;
    border-radius: 5px;
    color: #000;
    margin-top: 1rem;

    & > svg {
      margin-right: 0.625rem;
    }
  }
</style>
