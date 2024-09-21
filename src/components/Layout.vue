<template>
  <div class="h-100 position-relative">
    <Header
      @flagChange="handleFlagChange"
      :flagList="flagList"
      :currentFlag="currentFlag"
    />
    <slot />
    <Footer
      :countryCode="currentFlag ? currentFlag.countryCode.toLowerCase() : undefined" />

    <DialogConfirmChangedCountry
      :isOpen="openModalChangeCountry"
      :closeOnClickOutside="false"
      @discard="handleDiscardChangedCountry"
      @confirm="handleConfirmChangedCountry"
    />
  </div>
</template>

<script>
import { SINGAPORE_ISO_CODE, HONGKONG_ISO_CODE, INDONESIA_ISO_CODE, THAILAND_ISO_CODE } from '@/utils/constants.js'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import DialogConfirmChangedCountry from '@/components/dialog/DialogConfirmChangedCountry.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Header,
    Footer,
    DialogConfirmChangedCountry
  },

  props: {
    hasChangedData: {
      type: Boolean,
      default: false
    },

    openModalChangeCountry: {
      type: Boolean
    }
  },

  data: () => {
    return {
      flagList: [
        {
          urlImage: require('../../static/img/flag-sg.svg'),
          countryCode: SINGAPORE_ISO_CODE,
          countryValue: 'Singapore'
        },
        {
          urlImage: require('../../static/img/flag-hk.svg'),
          countryCode: HONGKONG_ISO_CODE,
          countryValue: 'Hong Kong'
        },
        {
          urlImage: require('../../static/img/flag-id.svg'),
          countryCode: INDONESIA_ISO_CODE,
          countryValue: 'Indonesia'
        },
        {
          urlImage: require('../../static/img/flag-th.svg'),
          countryCode: THAILAND_ISO_CODE,
          countryValue: 'Thailand'
        }
      ],
      currentFlag: undefined,
      changingCountry: undefined
    }
  },

  computed: {
    ...mapGetters({
      country: 'settings/country'
    })
  },

  watch: {
    country: {
      handler () {
        if (!this.country) {
          return
        }

        const flagItem = this.flagList.filter(item => item.countryCode === this.country.code)[0]
        if (!flagItem) {
          this.currentFlag = this.flagList[0]
        } else {
          this.currentFlag = flagItem
        }
      },
      immediate: true
    }
  },

  methods: {
    handleFlagChange (flagCode) {
      const currentCountryCode = this.$route.params.countryCode ? this.$route.params.countryCode.toUpperCase() : SINGAPORE_ISO_CODE
      if (flagCode === currentCountryCode) {
        return
      }

      this.changingCountry = flagCode

      if (this.hasChangedData) {
        this.showChangeCountryDialog()
      } else {
        this.handleConfirmChangedCountry()
      }
    },

    handleDiscardChangedCountry () {
      this.hideChangeCountryDialog()
    },

    async handleConfirmChangedCountry () {
      this.$emit('confirmChangeFlag')
      await this.$router.replace({
        params: {
          countryCode: this.changingCountry.toLowerCase()
        }
      })
      this.$router.go()
    },

    showChangeCountryDialog () {
      this.$emit('update:openModalChangeCountry', true)
    },

    hideChangeCountryDialog () {
      this.$emit('update:openModalChangeCountry', false)
    }
  }
}
</script>
