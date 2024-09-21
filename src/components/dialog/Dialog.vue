<template>
  <Modal :isOpen="isOpen" @update:isOpen="handleUpdateIsOpen">
    <DialogContent :title="title" @close="handleCloseButtonClick">
      <slot />
    </DialogContent>
  </Modal>
</template>

<script>
import Modal from '../Modal.vue'
import DialogContent from './DialogContent.vue'

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },

  components: {
    DialogContent,
    Modal
  },

  methods: {
    handleUpdateIsOpen (isOpen) {
      this.$emit('update:isOpen', isOpen)
    },

    handleCloseButtonClick () {
      this.closeModal()
    },

    closeModal () {
      this.$emit('update:isOpen', false)
    }
  }
}
</script>
