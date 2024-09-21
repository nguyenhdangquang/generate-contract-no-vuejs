<template>
  <Layout>
      <div class="ep__main_content pt-80">
      <section class="content b-radius-5 pt-40 pb-40">
        <div class="container">
          <div class="spage p-0 d-flex flex-wrap justify-content-between">
            <div class="d-flex align-items-center">
              <div class="contact-us-content">
                <EpLabel class="header-title" data-testid="headtitle">CONTACT US</EpLabel>
                <div data-testid="introduction" class="introduction-text">We would love to help you if you have any questions or require further information.<br />Here is how you can reach us.</div>
                <div class="row m-0">
                  <div class="column-icons"><img src="../../../static/img/address.svg" alt="Address"/></div>
                  <div class="pl-24 col"><EpLabel class="mb-0 contact-description" data-testid="Address" v-html="getAddress"></EpLabel></div>
                  <div class="w-100 row-contact-us-content"></div>
                  <div class="column-icons"><img src="../../../static/img/contactNumber.svg" alt="Tel"/></div>
                  <div class="pl-24 col"><EpLabel class="mb-0 contact-description" data-testid="Tel">{{getContactNumber}}</EpLabel></div>
                  <div class="w-100 row-contact-us-content"></div>
                  <div class="column-icons"><img src="../../../static/img/contactEmail.svg" alt="Email"/></div>
                  <div class="pl-24 col"><EpLabel class="mb-0 contact-description" data-testid="Email">{{getContactEmail}}</EpLabel></div>
                  <div class="w-100 row-contact-us-content"></div>
                  <div class="column-icons"><img src="../../../static/img/workingTime.svg" alt="Working hours"/></div>
                  <div class="pl-24 col"><EpLabel class="mb-0 contact-description" data-testid="WorkingHours" v-html="getWorkingTime"></EpLabel></div>
                </div>
              </div>
            </div>
            <div class="crop-area crop-area-option">
              <img id="map-image" class="card-img-top scale-map" :src="getMapImage" alt="Card image" data-testid="MapImage">
            </div>
          </div>
        </div>
      </section>
    </div>
  </Layout>
</template>
<script>
import EpLabel from '@/components/atoms/EpLabel'
import Layout from '@/components/Layout.vue'
import { settingsMixin } from '@/mixins/settings-mixin'
import { META_DESCRIPTION, META_DESCRIPTION_DEFAULT_PROP } from '@/utils/constants'

export default {
  metaInfo: {
    meta: [{
      ...META_DESCRIPTION_DEFAULT_PROP,
      content: META_DESCRIPTION.CONTACT_US
    }]
  },
  name: 'ContactUs',
  components: {
    EpLabel,
    Layout
  },
  mixins: [settingsMixin],
  props: {
    countryCode: {
      type: String
    }
  },
  async mounted () {
    window.addEventListener('resize', () => {
      this.widthResize = screen.width
    })
  },
  computed: {
    getAddress () {
      if (!this.country || !this.country.defaultReceivableOffice) {
        return
      }
      return this.country.defaultReceivableOffice.address
    },
    getContactNumber () {
      if (!this.country || !this.country.defaultReceivableOffice) {
        return
      }
      return this.country.defaultReceivableOffice.contactNumber
    },
    getContactEmail () {
      if (!this.country || !this.country.defaultReceivableOffice) {
        return
      }
      return this.country.defaultReceivableOffice.email
    },
    getWorkingTime () {
      if (!this.country || !this.country.defaultReceivableOffice) {
        return
      }
      return this.country.defaultReceivableOffice.workingTime
    },
    getMapImage () {
      if (!this.country || !this.country.defaultReceivableOffice) {
        return
      }

      return window.location.origin + '/' + this.country.defaultReceivableOffice.mapImageFileName
    }
  }
}
</script>
<style>
@import '../../../static/css/style.css';
@import '../../../static/css/contact-us.css';
</style>
