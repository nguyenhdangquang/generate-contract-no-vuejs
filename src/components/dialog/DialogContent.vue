<template>
  <div
    class="modal-dialog modal-lg modal-dialog-centered ep-modal-dialog"
    role="document"
  >
    <div class="modal-content">
      <div class="modal-header">
        <div
          data-testid="title"
          class="modal-title txt-24 txt-black txt-768-20"
        >
          {{ title }}
        </div>

        <ep-icon-button
          type="button"
          aria-label="Close"
          @click="handleCloseButtonClick"
        >
          <delete-icon />
        </ep-icon-button>
      </div>

      <div class="modal-body pb-5">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import EpIconButton from '../EpIconButton.vue'
import DeleteIcon from '../icons/DeleteIcon.vue'

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },

  components: {
    EpIconButton,
    DeleteIcon
  },

  methods: {
    handleCloseButtonClick () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
 .ep-modal-dialog {
    width: 800px;
 }
</style>
