<template>
  <Layout :hasChangedData="true"
          :openModalChangeCountry.sync="isOpenModalChangeCountry"
          @confirmChangeFlag="handleConfirmChangeFlag">
    <div class="ep__main_content pt-80 body-content">
      <section class="content__frame frame-information">
        <div class="header-information d-flex">
          <EpPageTitle class="header-information-title">Online Banking PayNow</EpPageTitle>
        </div>
        <hr class="w-100 m-0">
        <div class="content-information">
          <div class="content-information-header">
            <EpLabel class="content-information-header-note"><strong>Note:</strong> Please enter the following UEN, Total Amount, and Transaction UID as Payee Reference (13 digits only, no space or additional remarks) for the payment.</EpLabel>
          </div>
          <div class="row content-information-row">
            <div class="content-information-first-column">ONE's UEN:</div>
            <div>
              <span class="form__txtAmount" data-testid="uen">{{ UEN }}</span>
            </div>
            <div class="col p-0 text-right">
              <EpButton
                data-testid="copy-uen-button"
                class="copy-button"
                :class="{'copied-btn': copiedUEN}"
                @click="handleCopyTxnInfo('copyUEN')"
                variant="outlined"
              >
                {{ copiedUEN ? "Copied" : "Copy"}}
              </EpButton>
            </div>
          </div>
          <div class="row content-information-row">
            <div class="content-information-first-column">Payee Reference:</div>
            <div>
              <span class="form__txtAmount" data-testid="transactionUid">{{ transactionUid }}</span>
            </div>
            <div class="col p-0 text-right">
              <EpButton
                data-testid="copy-txn-uid-button"
                class="copy-button"
                :class="{'copied-btn': copiedTxnUid}"
                variant="outlined"
                @click="handleCopyTxnInfo('copyTxnUid')"
              >
                {{ copiedTxnUid ? "Copied" : "Copy"}}
              </EpButton>
            </div>
          </div>
          <div class="row content-information-row">
            <div class="content-information-first-column">Total Amount:</div>
            <div>
              <span class="form__txtAmount" data-testid="totalAmount">{{ currencyCode + ' ' + formattedTotalAmount }}</span>
            </div>
            <div class="col p-0 text-right">
              <EpButton
                data-testid="copy-total-amt-button"
                class="copy-button"
                :class="{'copied-btn': copiedTotalAmt}"
                variant="outlined"
                @click="handleCopyTxnInfo('copyTotalAmt')"
              >
                {{ copiedTotalAmt ? "Copied" : "Copy"}}
              </EpButton>
            </div>
          </div>
        </div>
        <div class="footer-information">
          <EpButton class="new-payment-button" @click="handleNewPaymentButton">New Payment</EpButton>
          <EpButton class="home-page-button" variant="outlined" color="secondary" @click="handleHomepageButton">
            Home Page
          </EpButton>
        </div>
      </section>
      </div>
      <DialogConfirmNavigation
      :isOpen="isOpenModalNavigation"
      :closeOnClickOutside="false"
      @discard="handleDiscardNavigation"
      @confirm="handleConfirmNavigation"
    />
  </Layout>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import EpLabel from '@/components/atoms/EpLabel'
import EpPageTitle from '@/components/atoms/EpPageTitle'
import Layout from '@/components/Layout.vue'
import EpButton from '@/components/EpButton.vue'
import DialogConfirmNavigation from '@/components/dialog/DialogConfirmNavigation.vue'
export default {
  name: 'OnlineBankingPayNow',

  components: {
    EpLabel,
    EpPageTitle,
    Layout,
    EpButton,
    DialogConfirmNavigation
  },

  props: {
    currencyCode: {
      type: String,
      required: true
    },
    transactionUid: {
      type: String,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      isOpenModalNavigation: false,
      isNavigateToHomePage: false,
      isChangingFlag: false,
      isOpenModalChangeCountry: false,
      isNavigateToAnotherPage: false,
      isClickingButtonOnPage: false,
      background: '',
      copiedData: '',
      copiedUEN: false,
      copiedTxnUid: false,
      copiedTotalAmt: false
    }
  },

  created () {
    this.navigateDialogEventBus = new Vue()
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  beforeDestroy () {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },

  computed: {
    ...mapGetters({
      settings: 'settings/settings'
    }),

    formattedTotalAmount () {
      if (!this.settings || !this.settings.country) {
        return '0'
      }

      return this.numberFormatter(
        this.settings.country.defaultCurrency.thousandSeparator,
        this.settings.country.defaultCurrency.decimalPlaces,
        this.totalAmount
      )
    },

    UEN () {
      if (!this.settings || !this.settings.defaultUEN) {
        return ''
      }
      return this.settings.defaultUEN
    }
  },

  methods: {
    handleNewPaymentButton () {
      this.isClickingButtonOnPage = true
      this.isNavigateToHomePage = false
      this.openNavigationModal()
    },

    handleHomepageButton () {
      this.isClickingButtonOnPage = true
      this.isNavigateToHomePage = true
      this.openNavigationModal()
    },

    handleDiscardNavigation () {
      this.navigateDialogEventBus.$emit('discardNavigate')
      this.isOpenModalNavigation = false
      this.isClickingButtonOnPage = false
    },

    handleConfirmNavigation () {
      if (this.isClickingButtonOnPage) {
        if (this.isNavigateToHomePage) {
          this.$router.push('/' + this.settings.country.code.toLowerCase())
        } else {
          this.$router.go()
        }
      } else {
        this.navigateDialogEventBus.$emit('confirmNavigate')
        this.isOpenModalNavigation = false
      }
    },

    handleCopyTxnInfo (infoType) {
      switch (infoType) {
        case 'copyUEN':
          this.copiedData = this.UEN
          if (!this.copiedUEN) {
            this.copiedUEN = true
            setTimeout(() => {
              this.copiedUEN = false
            }, 2000)
          }
          break
        case 'copyTxnUid':
          this.copiedData = this.transactionUid
          if (!this.copiedTxnUid) {
            this.copiedTxnUid = true
            setTimeout(() => {
              this.copiedTxnUid = false
            }, 2000)
          }
          break
        case 'copyTotalAmt':
          this.copiedData = this.totalAmount
          if (!this.copiedTotalAmt) {
            this.copiedTotalAmt = true
            setTimeout(() => {
              this.copiedTotalAmt = false
            }, 2000)
          }
          break
        default:
          break
      }

      const input = document.createElement('input')
      input.setAttribute('value', this.copiedData)
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    },

    openNavigationModal () {
      this.isNavigateToAnotherPage = true
      this.isOpenModalNavigation = true
    },

    handleConfirmChangeFlag () {
      this.isChangingFlag = true
    },

    async handleBeforeUnload (e) {
      if (!this.isChangingFlag && !this.isNavigateToAnotherPage) {
        e.preventDefault()
        e.returnValue = ''
      }
    },

    async triggerRouterGuard () {
      if (this.isClickingButtonOnPage) {
        return true
      }

      this.isOpenModalNavigation = true
      return new Promise((resolve) => {
        this.navigateDialogEventBus.$on('discardNavigate', () => {
          this.isOpenModalNavigation = false
          resolve(false)
        })

        this.navigateDialogEventBus.$on('confirmNavigate', () => {
          this.isOpenModalNavigation = false
          resolve(true)
        })
      })
    }
  }
}

</script>

<style>

@import '../../../../static/css/online-banking-paynow.css';
@import '../../../../static/css/style.css';
</style>
<style scoped>
.copied-btn {
  background-color: green !important;
  color: white !important;
  border: 1px solid green !important;
  transition: background-color .5s;
}
</style>
