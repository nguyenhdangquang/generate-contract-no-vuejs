<template>
  <button type="button" :class="className" @click="handleClick">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'default',
      validator (value) {
        return ['default', 'primary'].indexOf(value) !== -1
      }
    }
  },

  computed: {
    className () {
      const classNames = ['btn ep-icon-button', `ep-icon-button--${this.color}-color`]
      return classNames.join(' ').trim()
    }
  },

  methods: {
    handleClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="scss" scoped>
  .ep-icon-button {
    display: flex;
    align-items: center;

    &--default-color {
      color: #666;

      &:hover {
        opacity: 0.6;
        color: #666;
      }
    }

    &--primary-color {
      color: #BD0F72;

      &:hover {
        opacity: 0.6;
        color: #BD0F72;
      }
    }

    &:disabled {
      opacity: 0.6;
      &:hover {
        cursor: not-allowed;
      }
    }
  }
</style>
