<template>
  <Layout>
      <div class="ep__main_content pt-80">
      <section class="content pt-40">
        <div class="container spage p-0">
          <EpPageTitle class="spage__br-bt mb-0 p-40">
            <EpLabel class="mb-0 spage__headtile">USER GUIDE</EpLabel>
          </EpPageTitle>
          <div class="user-guide-content mb-40">
            <p class="user-guide-download-label">Download the User Guide as PDF</p>
            <p class="m-0">You can click the PDF file below to download User Guide. If you can't find what you're looking for, please <router-link class="user-guide-contact-us" :to="`/${countryCode}/contact-us`">contact us</router-link> to get help.</p>
            <div class="d-inline-flex align-items-center mt-32 mb-32 user-guide-download-box">
              <img class="mr-8" src="../../../static/img/pdf.svg" alt="proceed-to-pay-icon" heigh="32px" width="32px">
              <a class="mr-8 download-pdf" :href="this.country.userGuide.filePath + '?v=' + Date.now()" download>E-Payment User Guide.pdf</a>
              <span class="mr-8">-</span>
              <span class="">{{this.country.userGuide.fileSize}}</span>
            </div>
            <div data-testid="publication-date" class="d-flex flex-column">
              <span class="date-title">Publication date:</span>
              <span>{{this.country.userGuide.publicationDate}}</span>
            </div>
            <div data-testid="last-updated" class="d-flex flex-column mt-16">
              <span class="date-title">Last updated:</span>
              <span>{{this.country.userGuide.lastUpdated}}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Layout>
</template>
<style lang="scss" scoped>
  @import '../../../static/css/style.css';
  .user-guide-content {
    background-color: white;
    padding: 56px 40px 56px 40px;
    color: black;
    min-height: 600px;
  }
  .user-guide-download-label {
    font-size: 24px;
    font-weight: 600;
    color: #004D6C;
  }
  .user-guide-contact-us {
    color: #BD0F72 !important;
    text-decoration: underline;
  }
  .user-guide-download-box {
    border-left: 4px solid #004D6C;
    background-color: #F8F8F8;
    padding: 8px 32px 8px 24px;
    a {
      color: #004D6C !important;
      text-decoration: underline !important;
    }

    span {
      color: #666666;
    }
  }

  .date-title {
    font-weight: 700;
  }
</style>
<script>
import EpPageTitle from '@/components/atoms/EpPageTitle'
import EpLabel from '@/components/atoms/EpLabel.vue'
import Layout from '@/components/Layout.vue'
import { settingsMixin } from '@/mixins/settings-mixin'
import { META_DESCRIPTION, META_DESCRIPTION_DEFAULT_PROP } from '@/utils/constants'
import { mapGetters } from 'vuex'

export default {
  metaInfo: {
    meta: [{
      ...META_DESCRIPTION_DEFAULT_PROP,
      content: META_DESCRIPTION.USER_GUIDE
    }]
  },
  name: 'UserGuide',
  components: {
    EpPageTitle,
    EpLabel,
    Layout
  },
  computed: {
    ...mapGetters({
      country: 'settings/country'
    })
  },
  mixins: [settingsMixin],
  props: {
    countryCode: {
      type: String
    },

    userGuideDownloadUrl: {
      type: String
    }
  }
}
</script>
