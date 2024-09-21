<template>
  <Modal :isOpen="isOpen">
    <div class="ep-save-email-dialog" :class="`${countryCode}-dialog`">
      <SaveAndEmailIcon />
      <div class="content align-self-center txt-gray w-100">
        <EpLabel class="mb-0 title txt-black">{{getTextByCountryCode(countryCode,'createPOPage_poCreation_successfullyPopup_text')}} Created Successfully!</EpLabel>
        <div class="description mb-8">
         {{getTextByCountryCode(countryCode,'createPOPage_poCreation_successfullyPopup_text')}} <span class="txt-pink" data-testid="poNumber">{{poNumber}}</span> has been created and sent to your email.
        </div>
        <div class="txt-gray question">
          Do you want to create a new one?
        </div>
        <div class="d-flex justify-content-between ep__btn_group">
          <EpButton class="mr-16 b-radius-5" :class="`${countryCode}-dialog-create-button`" @click="handleCreateNewOne">Create a New One</EpButton>
          <EpButton
            class="ml-16 b-radius-5 ep__btn_details"
            :class="`${countryCode}-dialog-view-button`"
            variant="outlined"
            color="secondary" @click="handleViewDetails">View Details</EpButton>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import SaveAndEmailIcon from '@/components/icons/SaveAndEmailIcon.vue'
import EpLabel from '@/components/atoms/EpLabel.vue'
import EpButton from '@/components/EpButton.vue'
import Modal from '@/components/Modal.vue'
import { getTextByCountry } from '@/utils/displayTextResources'
export default {
  components: {
    SaveAndEmailIcon,
    EpLabel,
    EpButton,
    Modal
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    poNumber: {
      type: String,
      default: ''
    },
    countryCode: {
      type: String
    }
  },
  methods: {
    getTextByCountryCode (countryCode, text) {
      return getTextByCountry(countryCode.toUpperCase(), text)
    },
    handleCreateNewOne () {
      this.$emit('createNewOne')
    },
    handleViewDetails () {
      this.$emit('viewDetails')
    }
  }
}
</script>
<style lang="scss">
.ep-save-email-dialog {
  padding-top: 32px;
  padding-bottom: 32px;
  background-color: #fff;
  width: 530px;
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  .content {
    text-align: center;
    .title {
      font-size: 24px;
      line-height: 24px;
      font-weight: 700;
      margin-top: 16px;
    }
    .description {
      padding-top: 16px;
      font-size: 16px;
      line-height: 16px;
      font-weight: 400;
      span {
        font-weight: 700;
      }
    }
    .question {
      font-size: 16px;
      line-height: 16px;
      font-weight: 400;
    }
    .ep__btn_group {
      padding: 32px 68px 0 68px;
    }
    .ep__btn_details {
      padding: 11px 45px;
    }
  }
}
.id-dialog {
  width: 643px !important;
}
.id-dialog-create-button {
  margin-left: 12%;
}
.id-dialog-view-button {
  margin-right: 10%;
}

.th-dialog {
  width: 643px !important;
}
.th-dialog-create-button {
  margin-left: 12%;
}
.th-dialog-view-button {
  margin-right: 10%;
}
</style>
