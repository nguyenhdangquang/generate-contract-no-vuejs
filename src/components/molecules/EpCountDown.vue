<template>
  <span class="time">
    {{ displayTime }}
  </span>
</template>

<script>
export default {
  props: {
    expiry: {
      type: String,
      required: false
    }
  },

  data () {
    return {
      interval: null,
      secondsRemaining: null
    }
  },

  computed: {
    displayTime () {
      if (this.secondsRemaining == null) return ''
      if (this.secondsRemaining < 0) return '00:00'
      return this.toDisplayTime()
    }
  },

  watch: {
    expiry: {
      handler (newExpiry, oldExpiry) {
        if (newExpiry === null && oldExpiry !== null) {
          this.clearInterval()
          return
        }

        this.secondsRemaining = null
        this.clearInterval()
        this.calSecondsRemaining()
        if (this.secondsRemaining > 0) {
          this.setInterval()
        } else {
          this.secondsRemaining = 0
        }
      },
      immediate: true
    }
  },

  destroyed () {
    this.clearInterval()
  },

  methods: {
    calSecondsRemaining () {
      const expiryDateObject = new Date(this.expiry)
      this.secondsRemaining = Math.floor((expiryDateObject.getTime() - Date.now()) / 1000)
      if (this.secondsRemaining <= 0) {
        this.$emit('timeout')
        this.clearInterval()
      }
    },

    toDisplayTime () {
      const tr = this.secondsRemaining
      return `${Math.floor(tr / 60) < 10 && Math.floor(tr / 60) >= 0 ? '0' : ''}${Math.floor(tr / 60)}:${Math.floor(tr % 60) < 10 && Math.floor(tr % 60) >= 0 ? '0' : ''}${tr % 60}`
    },

    setInterval () {
      this.interval = setInterval(() => {
        this.calSecondsRemaining()
      }, 1000)
    },

    clearInterval () {
      if (this.interval) {
        clearInterval(this.interval)
      }
    }
  }
}
</script>

<style>
  .time {
    color: #BD0F72 !important;
    font-weight: bold;
  }
</style>
