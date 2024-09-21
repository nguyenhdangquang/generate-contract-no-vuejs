<template>
  <Modal :isOpen="isRequesting">
    <div id="loading-modal">
      <EpSpinner class="icon"/>
      <p data-testid="title-loading" class="title-loading">{{ title }}</p>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue'
import EpSpinner from './EpSpinner.vue'

export default {
  components: { Modal, EpSpinner },

  props: {
    isRequesting: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Your data is being processed. Please wait...'
    }
  }
}
</script>

<style lang="scss" scoped>
  #loading-modal {
    background-color: #fff;
    width: 393px;
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;

    .title-loading {
      margin-top: 20px;
    }
    .icon {
      width: 4.5rem;
      height: 4.5rem;
    }
  }
</style>
