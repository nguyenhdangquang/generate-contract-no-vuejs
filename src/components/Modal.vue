<template>
  <MountingPortal mountTo="#modals-target" append>
    <div
      data-testid="modal-backdrop"
      v-if="isOpen"
      class="ep-modal-backdrop"
    />

    <div
      v-if="isOpen"
      ref="modal"
      class="ep-modal"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      aria-modal="true"
      data-testid="modal"
    >
      <slot />
    </div>
  </MountingPortal>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },

    closeOnClickOutside: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      bodyStyleChanged: false,
      fixedElements: []
    }
  },

  watch: {
    isOpen: {
      handler (isOpen) {
        const hasScrollbar = document.body.scrollHeight > window.innerHeight
        const scrollbarWidth = this.getScrollBarWidth()

        if (isOpen) {
          if (!hasScrollbar) {
            return
          }

          this.fixedElements = [...document.body.getElementsByTagName('*')]
            .filter(e => window.getComputedStyle(e).getPropertyValue('position') === 'fixed')
          this.fixedElements.forEach(e => {
            const paddingRight = parseFloat(window.getComputedStyle(e).getPropertyValue('padding-right')) || 0
            e.style.paddingRight = `${paddingRight + scrollbarWidth}px`
          })

          document.body.classList.add('body__overflowPrevented')
          document.body.style.paddingRight = `${scrollbarWidth}px`
          this.bodyStyleChanged = true
        } else {
          this.handleModalClose()
        }
      },
      immediate: false
    }
  },

  mounted () {
    document.addEventListener('mousedown', this.handleClickOutside)
    document.addEventListener('keydown', this.handleKeyDown)
  },

  beforeDestroy () {
    document.removeEventListener('mousedown', this.handleClickOutside)
    document.removeEventListener('keydown', this.handleKeyDown)

    this.handleModalClose()
  },

  methods: {
    handleModalClose () {
      if (!this.bodyStyleChanged) {
        return
      }

      document.body.classList.remove('body__overflowPrevented')
      document.body.style.paddingRight = ''
      this.fixedElements.forEach(e => {
        e.style.paddingRight = ''
      })
      this.fixedElements = []
      this.bodyStyleChanged = false
    },

    handleClickOutside (event) {
      if (
        this.isOpen &&
        this.$refs.modal &&
        !this.$refs.modal.contains(event.target) &&
        this.closeOnClickOutside
      ) {
        this.closeModal()
      }
    },

    handleKeyDown (event) {
      if (!this.closeOnClickOutside) {
        return
      }

      const key = event.which || event.keyCode
      if (key === 27) {
        this.closeModal()
      }
    },

    closeModal () {
      this.$emit('update:isOpen', false)
    },

    getScrollBarWidth () {
      const div = document.createElement('div')
      div.style.overflowY = 'scroll'
      div.style.width = '50px'
      div.style.height = '50px'
      document.body.appendChild(div)
      const scrollWidth = div.offsetWidth - div.clientWidth

      document.body.removeChild(div)

      return scrollWidth
    }
  }
}
</script>

<style lang="scss">
  .body__overflowPrevented {
    touch-action: none;
    overflow: hidden;
  }
</style>

<style lang="scss" scoped>
 .ep-modal {
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   z-index: 1032;
 }

 .ep-modal-backdrop {
   background: rgba(0, 0, 0, 0.75);
   position: fixed;
   z-index: 1031;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
 }
</style>
