<template>
  <Modal :isOpen="isOpen">
    <div class="qr-code-expired-wrapper">
      <img src="../../../static/img/warning.svg" width="72" height="72" alt="warning-icon">
      <p class="title"  data-testid="headtitle">Your QR code is expired</p>
      <p data-testid="subtitle">You can click Retry to regenerate QR code</p>
      <div class="btn-wrapper">
        <EpButton class="btn retry" @click="handleRetry" data-testid="retry-button">Retry</EpButton>
        <EpButton
          class="btn newpayment"
          @click="handleNewPayment"
          data-testid="newpayment-button"
        >
          New Payment
        </EpButton>
      </div>
    </div>
  </Modal>
</template>
<script>
import Modal from '../Modal.vue'
import EpButton from '../EpButton.vue'

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
    handleRetry () {
      this.$emit('retry')
    },

    handleNewPayment () {
      this.$emit('newPayment')
    }
  }
}
</script>
<style lang="scss" scoped>
  p {
    margin-bottom: 0 !important;
  }
  .qr-code-expired-wrapper {
    width: 100%;
    min-width: 434px;
    height: 100%;
    min-height: 282px;
    background: #FFFFFF;
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 50px 30px 30px 30px;
    justify-content: space-between;

    .title {
      color: #000000;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-top: 16px;
      line-height: 24px;
      margin-bottom: 16px !important;
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

      .retry:hover {
        background-color: #FFFFFF;
      }

      .newpayment {
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
