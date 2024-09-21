<template>
  <Modal :closeOnClickOutside="closeOnClickOutside" :isOpen="isOpen">
    <div class="confirm-dialog">
      <img width="72" height="72" src="../../../static/img/navigation.svg" alt="ChangedCountry" />

      <div class="title" data-testid="title">Confirm Navigation</div>

      <div class="message" data-testid="message">Do you want to leave this page?</div>

      <div class="buttons d-flex">
        <EpButton class="confirm-button" @click="$emit('confirm')">Confirm</EpButton>

        <EpButton
          class="discard-button"
          variant="outlined"
          color="secondary"
          @click="$emit('discard')"
        >
          Discard
        </EpButton>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue'
import EpButton from '@/components/EpButton.vue'

export default {
  components: { Modal, EpButton },

  props: {
    isOpen: {
      type: Boolean,
      required: true
    },

    closeOnClickOutside: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .confirm-dialog {
    background-color: #fff;
    width: 393px;
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;

    .title {
      font-weight: 700;
      font-size: 24px;
      color: #000;
      margin-top: 16px;
      line-height: 24px;
    }

    .message {
      margin-top: 1rem;
      width: 250px;
      text-align: center;
      line-height: 1rem;
    }

    .buttons {
      margin-top: 2rem;
      width: 334px;
      justify-content: center;
    }

    .discard-button {
      margin-left: 32px;
      width: 9rem;
    }

    .confirm-button {
      width: 9rem;
    }
  }
</style>
