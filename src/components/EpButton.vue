<template>
  <button :disabled="disabled" :class="className" @click="handleClick">
    <ep-spinner class="icon" v-if="state === 'loading'" />
    <tick-icon class="icon" v-else-if="state === 'success'" />
    <slot v-else />
  </button>
</template>

<script>
import EpSpinner from './EpSpinner.vue'
import TickIcon from './icons/TickIcon.vue'

export default {
  components: { EpSpinner, TickIcon },

  props: {

    classes: {
      type: String,
      default: function () {
        return ''
      }
    },

    variant: {
      type: String,
      default: 'filled',
      validator (value) {
        return ['filled', 'outlined'].indexOf(value) !== -1
      }
    },

    color: {
      type: String,
      default: 'primary',
      validator (value) {
        return ['primary', 'success', 'secondary'].indexOf(value) !== -1
      }
    },

    disabled: {
      type: Boolean,
      default: false
    },

    state: {
      type: String,
      default: 'default',
      validator (value) {
        return ['success', 'default', 'loading'].indexOf(value) !== -1
      }
    }
  },

  computed: {
    className () {
      const classNames = [`ep-btn btn ep-btn--${this.color}`]

      if (this.state !== 'default') {
        classNames.push(`ep-btn--${this.state}`)
      } else {
        classNames.push(`ep-btn--${this.variant}`)
      }

      return [...classNames, this.classes].join(' ')
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
  .ep-btn {
    min-height: 38px;
    padding: 11px 24px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--filled {
      &.ep-btn--primary {
        background-color: #BD0F72;
        border: 1px solid #BD0F72;

        &:hover:enabled {
          color: #BD0F72;
        }
      }

      &.ep-btn--success {
        background-color: #63A375;
        border: 1px solid #63A375;

        &:hover:enabled {
          color: #63A375;
        }
      }

      &.ep-btn--secondary {
        background-color: #004D6C;
        border: 1px solid #004D6C;

        &:hover:enabled {
          color: #004D6C;
        }
      }

      color: #FFF;

      &:hover:enabled {
        background-color: #FFF;
      }

      &:hover:disabled {
        color: white;
      }
    }

    &--outlined, &--loading, &--success, &--secondary {
      &.ep-btn--primary {
        color: #BD0F72;
        border: 1px solid #BD0F72;

        &:hover {
          background-color: #BD0F72;
        }
      }

      &.ep-btn--success {
        color: #63A375;
        border: 1px solid #63A375;

        &:hover {
          background-color: #63A375;
        }
      }

      &.ep-btn--secondary {
        color: #004D6C;
        border: 1px solid #004D6C;

        &:hover {
          background-color: #004D6C;
        }
      }

      background-color: white;

      &:hover {
        color: white;
      }
    }

    .icon {
      color: currentColor;
    }
  }
</style>
