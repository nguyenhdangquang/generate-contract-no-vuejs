<template>
  <div class="dropdown-wrapper" ref="trigger" @click="handleTriggerClicked">
    <slot v-if="selectedItem" name="selectedItem" :selectedItem="selectedItem" />

    <MountingPortal mountTo="#dropdowns-target" append>
      <div ref="dropdown" class="dropdown" :class="dropdownClass" v-if="isOpen" data-testid="dropdown">
        <ul class="list">
          <li
            v-for="item in items"
            class="list-item"
            :key="item[itemKey]"
            @click="handleSelectItem(item)"
          >
            <slot name="item" :item="item" />
          </li>
        </ul>
      </div>
    </MountingPortal>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    },

    selectedItem: {
      type: Object,
      default: undefined
    },

    itemKey: {
      type: String,
      default: 'value'
    },

    disabled: {
      type: Boolean,
      default: false
    },

    dropdownClass: {
      type: String
    }
  },

  data () {
    return {
      isOpen: false,
      position: {
        left: 0,
        top: 0
      }
    }
  },

  mounted () {
    window.addEventListener('mousedown', this.handleClickOutside)
  },

  beforeDestroy () {
    window.removeEventListener('mousedown', this.handleClickOutside)
  },

  methods: {
    async handleTriggerClicked (event) {
      if (this.disabled) {
        return
      }

      if (this.isOpen) {
        this.closeDropdown()
      } else {
        this.openDropdown()
        await this.$nextTick()

        if (this.$refs.dropdown && this.$refs.trigger) {
          const clientRect = this.$refs.trigger.getBoundingClientRect()

          /**
           * window.pageYOffset to support IE 11
           */
          const windowScrollTop = window.scrollY || window.pageYOffset

          this.$refs.dropdown.style.left = `${clientRect.left}px`
          this.$refs.dropdown.style.top = `${clientRect.bottom + windowScrollTop}px`

          const dropdownRect = this.$refs.dropdown.getBoundingClientRect()
          const componentRight = clientRect.left + dropdownRect.width
          const outsideOfRightViewport = componentRight > document.documentElement.clientWidth

          if (outsideOfRightViewport) {
            this.$refs.dropdown.style.left = `${document.documentElement.clientWidth - dropdownRect.width - 16}px`
          }
        }
      }
    },

    handleClickOutside (event) {
      /**
       * @type {HTMLElement}
       */
      const target = event.target
      if (
        this.$refs.dropdown &&
        !this.$refs.dropdown.contains(target) &&
        !this.$refs.trigger.contains(target)
      ) {
        this.closeDropdown()
      }
    },

    handleSelectItem (item) {
      this.emitSelectItem(item)
      this.closeDropdown()
    },

    openDropdown () {
      this.isOpen = true
    },

    closeDropdown () {
      this.isOpen = false
    },

    emitSelectItem (item) {
      this.$emit('update:selectedItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>
  .dropdown {
    position: absolute;
  }

  .list {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    margin: 0;
    padding: 0.5rem 0;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: #fff;
    border-radius: 0.25rem;
  }

  .list-item {
    color: #16181b;
    padding: 0.25rem 1.5rem;
    display: block;
    border-bottom: 0;
    white-space: nowrap;
    &:hover {
      cursor: pointer;
      background-color: #e9ecef;
    }
  }
</style>
