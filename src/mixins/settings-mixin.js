import { mapActions, mapGetters } from 'vuex'
import StorageHelper from '@/utils/storageHelper'
import * as Authenticator from '@/repositories/Authenticator'
import { ISO_CODE_LIST } from '@/utils/constants'
import { getTextByCountry } from '@/utils/displayTextResources'
import { getErrorMessageByCountry } from '@/repositories/ConfigErrorMessage'

export const settingsMixin = {
  data () {
    return {
      errorMessageByCountry: null
    }
  },

  computed: {
    ...mapGetters({
      country: 'settings/country'
    })
  },

  watch: {
    country: {
      async handler (value, prevValue) {
        if (!prevValue && value && (!this.countryCode || ISO_CODE_LIST.indexOf(this.countryCode.toUpperCase()) < 0)) {
          this.$router.replace({
            params: {
              countryCode: value.code.toLowerCase()
            },
            name: this.$route.name
          }).catch(() => { /* istanbul ignore next */ })
        }
      }
    }
  },

  async mounted () {
    this.errorMessageByCountry = getErrorMessageByCountry(this.countryCode ? this.countryCode.toUpperCase() : 'SG')
    if (!StorageHelper.getItem('tka')) {
      const accessToken = await Authenticator.generateAccessToken()
      if (!accessToken) {
        return
      }
      StorageHelper.setItem('tka', accessToken)
    }

    if (this.country && this.country.code.toLowerCase() === this.countryCode) {
      return
    }
    let requestingLang = this.countryCode
    if (!requestingLang || ISO_CODE_LIST.indexOf(requestingLang.toUpperCase()) < 0) {
      requestingLang = undefined
    }
    this.getSettings(requestingLang)
  },

  methods: {
    ...mapActions({
      getSettings: 'settings/getSettings'
    }),

    getDisplayText (text, params = []) {
      const countryURL = window.location.pathname ? window.location.pathname.slice(1, 3).toUpperCase() : 'SG'
      return getTextByCountry(countryURL, text, params)
    }
  }
}
