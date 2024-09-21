<template>
  <Layout>
    <div class="main d-flex flex-column align-items-center justify-content-center">
      <div class="main__text">
        <span class="t--fontbold">ONE</span> offers online payment solutions for you to <span class="t--fontbold"><br>pay easily and securely </span>
      </div>
      <div class="main__btnGrp d-flex container justify-content-center">
        <router-link :to="`${countryCode ? `/${countryCode}` : ''}/create-po`"
        class="btn btn--bg btn--pink btn--font d-flex align-items-center justify-content-center">{{ this.getDisplayText('landingPage_createPO_button_text') }}</router-link>
      <router-link
        :to="`${countryCode ? `/${countryCode}` : ''}/pay-po`"
        class="ml-64 btn btn--bg btn--white btn--font d-flex align-items-center justify-content-center">{{ this.getDisplayText('landingPage_payPO_button_text') }}</router-link>
      </div>
    </div>
  </Layout>
</template>
<style>
  @import '../../static/css/index.css';
</style>
<script>
import { settingsMixin } from '@/mixins/settings-mixin'
import { META_DESCRIPTION, META_DESCRIPTION_DEFAULT_PROP } from '@/utils/constants'
import Layout from '@/components/Layout.vue'

export default {
  metaInfo: {
    meta: [{
      ...META_DESCRIPTION_DEFAULT_PROP,
      content: META_DESCRIPTION.LANDING_PAGE
    }]
  },
  name: 'Home',

  components: {
    Layout
  },

  mixins: [settingsMixin],

  props: {
    countryCode: {
      type: String,
      default: undefined
    }
  }
}
</script>
