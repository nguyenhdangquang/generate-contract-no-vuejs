<template>
  <Modal :closeOnClickOutside="closeOnClickOutside" :isOpen="isOpen" @update:isOpen="handleUpdateIsOpen">
    <div class="cancel-dialog">
      <img width="72" height="72" src="/img/cancel.svg" alt="Cancel" />

      <div class="title" data-testid="title">Confirm Payment Cancellation</div>

      <div class="message" data-testid="message">Do you want to cancel transaction?</div>

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
  },

  methods: {
    handleUpdateIsOpen (isOpen) {
      this.emitIsOpen(isOpen)
    },

    emitIsOpen (isOpen) {
      this.$emit('update:isOpen', isOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
  .cancel-dialog {
    background-color: #fff;
    width: 26rem;
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    padding: 2rem;
    padding-top: 3rem;
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
    }

    .buttons {
      margin-top: 2rem;
      width: 100%;
      justify-content: center;
    }

    .discard-button {
      margin-left: 2rem;
      width: 9rem;
    }

    .confirm-button {
      width: 9rem;
    }
  }
</style>
