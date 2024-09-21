<template>
  <Modal :isOpen="isOpen" @update:isOpen="handleUpdateIsOpen">
    <div class="ep-error-dialog">
      <ExclamationCircle class="error-icon" />

      <div class="title text-center" data-testid="title">{{ title }}</div>

      <div class="description" data-testid="description">{{ description }}</div>

      <EpButton class="confirm-button" @click="handleConfirmButtonClick">OK</EpButton>
    </div>
  </Modal>
</template>

<script>
import EpButton from '@/components/EpButton.vue'
import Modal from '@/components/Modal.vue'
import ExclamationCircle from '@/components/icons/ExclamationCircle.vue'

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String
    },
    description: {
      type: String
    }
  },

  components: {
    Modal,
    ExclamationCircle,
    EpButton
  },

  methods: {
    handleUpdateIsOpen (isOpen) {
      this.$emit('update:isOpen', isOpen)
    },

    handleConfirmButtonClick () {
      this.$emit('update:isOpen', false)
    }
  }
}
</script>

<style lang="scss">
  .ep-error-dialog {
    background: #fff;
    width: 20rem;
    border-radius: 5px;
    padding: 32px 0px 32px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;

    .error-icon {
      color: #DD3537;
    }

    .title {
      font-weight: 700;
      font-size: 24px;
      color: #000;
      margin-top: 16px;
      line-height: 24px;
    }

    .description {
      margin-top: 1rem;
      text-align: center;
      color: #000;
      width: 100%;
    }

    .confirm-button {
      margin-top: 2rem;
      min-width: 150px;
      min-height: 48px;
    }
  }
</style>
