<template>
  <Modal :isOpen="isOpen">
    <div class="proceed-to-pay-wrapper">
      <img width="72" height="72" src="../../../static/img/proceedToPay.svg" alt="proceed-to-pay-icon">
      <p class="title" data-testid="headtitle">Proceed to Pay</p>
      <p data-testid="subtitle" class="subtitle font-16">By clicking confirm, you continue with the payment</p>
      <div class="btn-wrapper">
        <EpButton class="btn confirm" @click="handleConfirm" data-testid="confirm-button">Confirm</EpButton>
        <EpButton class="btn discard" @click="handleDiscard" data-testid="discard-button">Discard</EpButton>
      </div>
    </div>
  </Modal>
</template>
<script>
import Modal from '../Modal'
import EpButton from '../EpButton'

export default {
  components: {
    Modal,
    EpButton
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleConfirm () {
      this.$emit('confirm')
    },

    handleDiscard () {
      this.$emit('discard')
    }
  }
}
</script>
<style lang="scss" scoped>
  p {
    margin-bottom: 0 !important;
  }
  .proceed-to-pay-wrapper {
    width: 100%;
    min-width: 434px;
    height: 100%;
    min-height: 282px;
    background: #FFFFFF;
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 32px 30px 32px 30px;
    justify-content: space-between;

    .title {
      color: #000000;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-top: 16px;
      line-height: 24px;
    }

    .subtitle {
      margin-top: 16px;
      font-weight: 500;
    }

    .btn-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      margin-top: 32px;

      .btn {
        min-width: 152px;
        min-height: 48px;
        background-color: #BD0F72;
        border-radius: 5px;
      }

      .confirm:hover {
        background-color: #FFFFFF;
      }

      .discard {
        background-color: #FFFFFF;
        border: 1px solid #004D6C;
        box-sizing: border-box;
        text-align: center;
        color: #004D6C;

        &:hover {
          background-color: #004D6C;
          color: #FFFFFF;
        }
      }
    }
  }
</style>
