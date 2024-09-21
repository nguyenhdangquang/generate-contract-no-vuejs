<template>
  <Layout
    :openModalChangeCountry.sync="isOpenChangeCountryModal"
    @confirmChangeFlag="handleConfirmChangeFlag"
    hasChangedData
  >
    <div class="ep__main_content pt-80">
      <section class="content">
        <div class="container p-0">
          <EpPageTitle class="font-36 mb-0 pb-32">
            QR Code
          </EpPageTitle>
          <div class="row d-flex justify-content-between mb-88">
            <div class="col-lg-5 col-12 margin-bottom-16 p-0">
              <div class="row m-0">
                <div
                  class="col-lg-12 col-md-6 col-6"
                  :class="{ 'col-md-12 col-12': !isShowBankingOnlineNote }"
                >
                  <div class="content__frame d-flex flex-column pb-0 pl-24 pt-32 h-100">
                    <div class="form__valid row m-0 pb-32">
                        <div class="font-16">
                          <span class="mr-24">Transaction ID:</span>
                          <span class="form__txtAmount">{{ createdPaymentTransaction.transactionUid }}</span>
                        </div>
                    </div>
                    <div class="form__valid row m-0 pb-32 font-16">
                        <span class="mr-32">Total Amount:</span>
                        <span class="form__txtAmount">{{ createdPaymentTransaction.currency }} </span>
                        <span class="form__txtAmount ml-2" data-testid="amount">{{ this.formattedTotalAmount }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="isShowBankingOnlineNote" class="col-lg-12 col-md-6">
                  <BankingOnlineNote @clickHereBankingOnlinePayNow="handleClickhereBankingOnlinePayNow"/>
                </div>
              </div>
            </div>
            <div class="col-lg-7 col-12">
                <div class="content__frame p-0">
                    <div class="d-flex flex-column align-items-center">
                        <EpLabel class="form__valid mt-56 mb-48 font-18 txt-gray">Please open your bank app to scan QR code</EpLabel>
                        <div class="qrcode">
                          <img data-testid="qrCodeImage" :src="'data:image/jpeg;base64,' + createdPaymentTransaction.qrCode" alt="" height="280" width="280">
                        </div>
                        <div class="form__valid mt-40 mb-40 row expired-text">
                            <div class="">Your QR code will be expired after:</div>
                            <EpCountDown
                              style="margin-left: 5px;"
                              @timeout="handleQrCodeExpire"
                              :expiry="qrCodeExpiry"
                            />
                        </div>
                        <button
                          type="button"
                          class="btn btn--main btn--blue btn--sm-scr save-btn mb-56 cancel-button"
                          data-testid="cancelButton"
                          @click='handleCancelButtonClick'
                        >
                          Cancel
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      <CancelDialog
        :isOpen="isCancelModalOpen"
        :closeOnClickOutside="false"
        @discard="handleDiscardCancel"
        @confirm="handleConfirmCancel"
      />

      <EpQrCodeExpired
        :isOpen="isExpiredModalOpen"
        :closeOnClickOutside="false"
        @retry="handleRetryTransaction"
        @newPayment="handleNewPayment"
      />

      <EpPaymentSuccess
        v-if="successData"
        v-bind="{
          isOpen: isShowPaymentSuccess,
          ...successData,
          country
        }"
        @newPayment="handleNavigateToNewPayment"
        @homePage="handleNavigateToHomepage"
      />
    </div>
  </Layout>
</template>

<script>
import Vue from 'vue'
import EpLabel from '../../components/atoms/EpLabel'
import EpPageTitle from '../../components/atoms/EpPageTitle'
import CancelDialog from '@/components/dialog/CancelDialog.vue'
import EpCountDown from '@/components/molecules/EpCountDown.vue'
import EpQrCodeExpired from '@/components/molecules/EpQrCodeExpired.vue'
import EpPaymentSuccess from '../../components/molecules/EpPaymentSuccess'
import * as paymentTransactionRepository from '@/repositories/PaymentTransactions'
import { TRANSACTION_STATUS } from './services/transaction-status'
import Layout from '@/components/Layout.vue'
import BankingOnlineNote from './components/BankingOnlineNote'
import { paymentGatewaySG } from './mixins/payment-gateway-sg'
import { paymentGatewayHK } from './mixins/payment-gateway-hk'
import { TransactionStatusListener } from './services/transaction-status-listener'

const countryURL = window.location.pathname ? window.location.pathname.slice(1, 3).toUpperCase() : 'SG'
const payment = (country) => {
  let mixins = null
  switch (country) {
    /**
     * Dynamic country to select payment gateway method by CASE
     */
    case 'SG': {
      mixins = paymentGatewaySG
      break
    }
    case 'HK': {
      mixins = paymentGatewayHK
      break
    }
    default: {
      mixins = paymentGatewaySG
    }
  }
  return mixins
}

export default {
  name: 'PaymentGateway',

  components: {
    EpLabel,
    EpPageTitle,
    CancelDialog,
    EpCountDown,
    EpQrCodeExpired,
    EpPaymentSuccess,
    Layout,
    BankingOnlineNote
  },

  mixins: [payment(countryURL)],

  props: {
    createdPaymentTransaction: {
      type: Object,
      required: true
    },
    country: {
      type: Object,
      required: true
    },
    countryCode: {
      type: String
    }
  },

  data () {
    return {
      isCancelModalOpen: false,
      isExpiredModalOpen: false,
      isShowPaymentSuccess: false,
      isChangingFlag: false,
      expiry: new Date(new Date().getTime() + 10 * 1000).toISOString(),
      successData: null,
      isOpenChangeCountryModal: false
    }
  },

  created () {
    this.cancelDialogEventBus = new Vue()
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  mounted () {
    this.startListener()
  },

  beforeDestroy () {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    this.closeListener()
  },

  computed: {
    formattedTotalAmount () {
      if (!this.country) {
        return '0'
      }

      return this.numberFormatter(
        this.country.defaultCurrency.thousandSeparator,
        this.country.defaultCurrency.decimalPlaces,
        this.createdPaymentTransaction.totalLocalAmount
      )
    },

    qrCodeExpiry () {
      if (this.isShowPaymentSuccess) {
        return null
      }

      return this.createdPaymentTransaction.qrCodeExpiry
    }
  },

  methods: {
    async handleTransactionStatus (event) {
      try {
        const data = JSON.parse(event.data)
        if (
          typeof data === 'object' &&
          data.type === 'paymentTransaction:updateStatus' &&
          data.transactionUid === this.createdPaymentTransaction.transactionUid &&
          data.status === 'success' &&
          data.payDate &&
          data.currency &&
          data.amount
        ) {
          this.successData = {
            amount: data.amount,
            currency: data.currency,
            payDate: data.payDate,
            transactionUid: data.transactionUid
          }
          this.openPaymentSuccessModal()
          this.hasCloseSocket()
        }
      } catch {}
    },

    handleConfirmChangeFlag () {
      this.updateTransactionStatusCancel()
      this.isChangingFlag = true
    },
    handleWebsocketOpen () {
      console.log('[WEBSOCKET] [OPEN]: Connection established')
    },
    handleWebsocketError (error) {
      console.log(`[WEBSOCKET] [ERROR]: ${error.message}`)
    },

    handleWebsocketClose (event) {
      if (event.wasClean) {
        console.log(`[WEBSOCKET] [CLOSE]: Connection closed cleanly, code=${event.code} reason=${event.reason}`)
      } else {
        console.log('[WEBSOCKET] [CLOSE]: Connection died, trying to reconnect')
        this.resetListener()
      }
    },

    startListener () {
      TransactionStatusListener.startListener()
      TransactionStatusListener.addLifeCycleListeners({
        onOpen: this.handleWebsocketOpen,
        onClose: this.handleWebsocketClose,
        onError: this.handleWebsocketError,
        onMessage: this.handleTransactionStatus
      })
    },

    closeListener () {
      TransactionStatusListener.removeLifeCycleListeners({
        onOpen: this.handleWebsocketOpen,
        onClose: this.handleWebsocketClose,
        onError: this.handleWebsocketError,
        onMessage: this.handleTransactionStatus
      })
      TransactionStatusListener.close()
    },

    resetListener () {
      this.closeListener()
      this.startListener()
    },

    handleBeforeUnload (e) {
      if (this.isShowPaymentSuccess || this.isExpiredModalOpen || this.isChangingFlag) {
        return
      }

      e.preventDefault()
      e.returnValue = ''
    },

    async triggerRouterGuard () {
      if (this.isShowPaymentSuccess || this.isExpiredModalOpen) {
        return true
      }

      this.openCancelModal()

      return new Promise((resolve) => {
        this.cancelDialogEventBus.$on('discardCancel', () => {
          this.closeCancelModal()
          resolve(false)
        })

        this.cancelDialogEventBus.$on('confirmCancel', () => {
          this.closeCancelModal()
          resolve(true)
        })
      })
    },

    handleDiscardCancel () {
      this.cancelDialogEventBus.$emit('discardCancel')
      this.closeCancelModal()
    },

    async handleConfirmCancel () {
      this.cancelDialogEventBus.$emit('confirmCancel')
      await this.updateTransactionStatusCancel()
      this.closeCancelModal()
    },

    async updateTransactionStatusCancel () {
      try {
        await paymentTransactionRepository.updateTransactionStatus(
          this.createdPaymentTransaction.transactionUid,
          TRANSACTION_STATUS.CANCEL_TRANSACTION
        )
      } catch {}
    },

    openCancelModal () {
      this.isCancelModalOpen = true
    },

    closeCancelModal () {
      this.isCancelModalOpen = false
    },

    async handleQrCodeExpire () {
      if (this.isShowPaymentSuccess) {
        return
      }

      this.openExpiredModal()
      try {
        await paymentTransactionRepository.updateTransactionStatus(
          this.createdPaymentTransaction.transactionUid,
          TRANSACTION_STATUS.QR_CODE_EXPIRED
        )
      } catch {}
    },

    async openExpiredModal () {
      this.closeChangeCountryModal()
      this.closeCancelModal()
      await this.$nextTick()
      this.isExpiredModalOpen = true
    },

    closeChangeCountryModal () {
      this.isOpenChangeCountryModal = false
    },

    closeExpiredModal () {
      this.isExpiredModalOpen = false
    },

    async openPaymentSuccessModal () {
      this.closeChangeCountryModal()
      this.closeExpiredModal()
      this.closeCancelModal()
      await this.$nextTick()
      this.isShowPaymentSuccess = true
    },

    handleNavigateToNewPayment () {
      this.handleNewPayment()
    },

    handleNavigateToHomepage () {
      this.$router.push({ name: 'Home', params: { countryCode: this.countryCode } })
    },

    async handleRetryTransaction () {
      this.closeExpiredModal()
      this.$emit('retry', this.createdPaymentTransaction.transactionUid)
    },

    async handleNewPayment () {
      this.$emit('newPayment')
    },

    async handleCancelButtonClick () {
      const shouldCancel = await this.triggerRouterGuard()
      if (!shouldCancel) {
        return
      }
      this.handleNewPayment()
    }
  }
}

</script>

<style>
@import '../../../static/css/style.css';
</style>

<style scoped>
.qrcode {
  background: url('../../../static/img/Corner Group.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  width: 312px;
  height: 312px;
  padding: 16px;
}

@media (min-width: 1024px) {
  .margin-lelf-24 {
    margin-left: 24px;
  }
}
@media (max-width: 1024px) {
  .margin-bottom-16 {
    margin-bottom: 16px;
  }
}

.cancel-button {
  padding: 11px 48px;
}

.expired-text {
  font-size: 16px;
}

.hide-note {
  display: none;
}
</style>
