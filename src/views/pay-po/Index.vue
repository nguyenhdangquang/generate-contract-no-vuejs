<template>
  <PaymentGateway
    v-if="createdPaymentTransaction && paymentGatewayMethod === paymentGatewayMethodEnum.QR_CODE"
    ref="paymentGateway"
    :createdPaymentTransaction="createdPaymentTransaction"
    :country="country"
    :countryCode="this.countryCode"
    @retry="retryTransaction"
    @newPayment="handleNewPayment"
  />
  <BankingOnlinePayNow
    ref="bankingOnlinePayNow"
    v-else-if="createdPaymentTransaction && paymentGatewayMethod === paymentGatewayMethodEnum.ONLINE_BANKING_PAYNOW"
    :transactionUid="createdPaymentTransaction.transactionUid"
    :totalAmount="totalAmount"
    :currencyCode="currencyCode"
  />
  <Layout
    v-else
    @confirmChangeFlag="handleConfirmChangeFlag"
    :hasChangedData="hasChangedData"
    :openModalChangeCountry.sync="isOpenModalChangeCountry"
  >
    <div>
      <section class="content ep__main_content pt-80">
        <div class="container" key="payPoContainer">
          <EpPageTitle>
            {{ this.getDisplayText('payPoPage_payPO_title')}}
          </EpPageTitle>
          <hr class="ep__border__line"/>
          <FloatingError :floatingErrors="floatingErrors"/>
          <!-- PO Info -->
          <EpPOPaymentHeader :countryCode="country && country.code"/>

          <EpPOPaymentRow
            v-for="(po, index) in poPaymentList"
            :key="po.no"
            :poItem="po"
            :index="index"
            :countryCode="country && country.code"
            @blur="handlePoNumberInputBlur(po)"
            @remove="handleRemovePO(po)"
            @update:poNumber="handleUpdatePoNumber(po, $event)"
          />
          <!-- End PO Info Content -->

          <!-- Add Row Button -->
          <EpPOPaymentRowManagement
            :blsCount="totalBls"
            :maxBls="MAX_BLS"
            :posCount="totalPos"
            :maxPos="MAX_POS"
            @add="addPO"
            :countryCode="this.countryCode"
          />
          <!-- End Add Row Button -->

          <!-- PO Additional Info -->
          <div class="content__frame mb-16">
            <div class="row ml-0 mr-0">
              <div class="col-lg-12 col-12 d-flex flex-column form__totalRight">
                <TotalAmount
                  :totalAmount="totalAmount"
                  :countryCode="this.countryCode"
                  :errorFn="(max, exceed, currency) => getTextByCountry(this.countryCode, 'payPOPage_totalAmount_label_errorMsg_exceedMax', [currency, max])"
                />
                <div class="pt-24 d-flex flex-column ">
                  <div class="d-flex justify-content-end align-items-end">
                    <div class="d-flex h-100">
                      <EpButton data-testid="proceed-to-pay-button" :disabled="!canProceedToPay" @click="openModalProceedToPay">Proceed to Pay</EpButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <EpPOProceedToPay
            :isOpen="isOpenModalProceedToPay"
            @confirm="handleConfirmProceedToPay"
            @discard="handleDiscardProceedToPay"
          />
          <!-- End PO Additional Info -->
          <!-- End PO Info -->
        </div>
      </section>
      <loading :isRequesting="isCreatingPayment" />
      <loading :isRequesting="isRetryingTransaction" title="Retrying your transaction. Please wait..."/>
    </div>
    <DialogConfirmNavigation
      :isOpen="isOpenModalNavigation"
      :closeOnClickOutside="false"
      @discard="handleCancelNavigation"
      @confirm="handleConfirmNavigation"
    />
    <div v-html="pageRedirectForm" data-testid="pageRedirectForm"></div>
  </Layout>
  <!-- End Content -->
</template>

<style>
@import '../../../static/css/style.css';
</style>

<script>
import Vue from 'vue'
import * as PurchaseOrderRepo from '@/repositories/PurchaseOrders'
import { mapActions, mapGetters } from 'vuex'
import EpPOPaymentRowManagement from '@/components/molecules/EpPOPaymentRowManagement'
import EpPOPaymentRow from '@/components/molecules/EpPOPaymentRow'
import TotalAmount from '@/components/TotalAmount'
import EpButton from '@/components/EpButton'
import EpPageTitle from '@/components/atoms/EpPageTitle'
import EpPOProceedToPay from '@/components/molecules/EpPOProceedToPay'
import { PO_NUMBER_ERRORS } from '@/views/pay-po/utils/errors'
import { PO_PAY_STATUS } from '@/views/pay-po/utils/consts'
import { validatePoNumber, isValidPoFormat } from '@/views/pay-po/services/validatePoNumber'
import { initPO, initRowData } from './services/poList.js'
import EpPOPaymentHeader from '@/components/molecules/EpPOPaymentHeader'
import { calculateAmount } from './services/totalAmount'
import FloatingError from '@/components/FloatingError.vue'
import * as paymentTransactions from '@/repositories/PaymentTransactions'
import * as handlePayPOErrors from './services/handle-error'
import PaymentGateway from '@/views/payment-gateway/Index.vue'
import BankingOnlinePayNow from '@/views/payment-gateway/components/BankingOnlinePayNow.vue'
import Loading from '@/components/Loading.vue'
import Layout from '@/components/Layout.vue'
import { settingsMixin } from '@/mixins/settings-mixin.js'
import DialogConfirmNavigation from '@/components/dialog/DialogConfirmNavigation.vue'
import { META_DESCRIPTION, META_DESCRIPTION_DEFAULT_PROP, PAYMENT_GATEWAY_METHOD } from '@/utils/constants'
import { getTextByCountry } from '@/utils/displayTextResources'

export default {
  metaInfo: {
    meta: [{
      ...META_DESCRIPTION_DEFAULT_PROP,
      content: META_DESCRIPTION.PAY_PO
    }]
  },
  name: 'PayPO',

  components: {
    EpPOPaymentHeader,
    EpPOPaymentRowManagement,
    EpPOPaymentRow,
    TotalAmount,
    EpPageTitle,
    EpButton,
    FloatingError,
    EpPOProceedToPay,
    PaymentGateway,
    Loading,
    Layout,
    DialogConfirmNavigation,
    BankingOnlinePayNow
  },

  mixins: [settingsMixin],

  props: {
    countryCode: {
      type: String
    }
  },

  data () {
    return {
      poPaymentList: [],
      isOpenModalProceedToPay: false,
      createdPaymentTransaction: null,
      isCreatingPayment: false,
      isRetryingTransaction: false,
      cachedPaidPOInforByNumbers: {},
      hasChangedData: false,
      isOpenModalNavigation: false,
      isChangingFlag: false,
      isOpenModalChangeCountry: false,
      paymentGatewayMethodEnum: PAYMENT_GATEWAY_METHOD,
      pageRedirectForm: null
    }
  },

  created () {
    this.navigationDialogEventBus = new Vue()
    this.MAX_POS = 450
    this.MAX_BLS = 450
  },

  async beforeRouteLeave (to, from, next) {
    if (from.path === to.path) {
      next()
      return
    }

    // HANDLE FOR QR CODE PAGE ONLY
    if (this.$refs.paymentGateway) {
      const shouldNavigateFromPaymentGateway = await this.$refs.paymentGateway.triggerRouterGuard()
      if (!shouldNavigateFromPaymentGateway) {
        next(false)
      } else {
        this.clearGlobalError()
        this.setCreatedPO(null)
        next(true)
      }

      return
    }

    // HANDLE FOR BANKING ONLINE PAYNOW PAGE ONLY
    if (this.$refs.bankingOnlinePayNow) {
      const shouldNavigateFromBankingOnlinePayNow = await this.$refs.bankingOnlinePayNow.triggerRouterGuard()
      if (!shouldNavigateFromBankingOnlinePayNow) {
        next(false)
      } else {
        this.clearGlobalError()
        this.setCreatedPO(null)
        this.setGlobalPaymentGatewayMethod(this.paymentGatewayMethodEnum.QR_CODE)
        next(true)
      }
      return
    }

    if (!this.hasChangedData) {
      this.clearGlobalError()
      this.setCreatedPO(null)
      next()
      return
    }

    const shouldNavigate = await this.triggerRouterGuard()
    if (shouldNavigate) {
      this.clearGlobalError()
      this.setCreatedPO(null)
      next(true)
      return
    }

    next(false)
  },

  computed: {
    ...mapGetters({
      createdPO: 'purchaseOrder/createdPO',
      paymentGatewayMethod: 'application/getPaymentGatewayMethod'
    }),

    floatingErrors () {
      return this.poPaymentList.filter(po => !!po.error)
    },

    currencyCode () {
      if (!this.country || !this.country.defaultCurrency) {
        return ''
      }
      return this.country.defaultCurrency.code
    },

    totalBls () {
      return this.poPaymentList
        .map(po => po.records || 0)
        .reduce((total, records) => total + records, 0)
    },

    totalPos () {
      return this.poPaymentList.length
    },

    totalAmount () {
      if (!this.country || !this.country.defaultCurrency) {
        return 0
      }

      return calculateAmount(
        this.country.defaultCurrency.decimalPlaces,
        this.poPaymentList,
        this.country.defaultCurrency.thousandSeparator
      )
    },

    canProceedToPay () {
      if (!this.country || !this.country.defaultCurrency || this.poPaymentList.length === 0) {
        return false
      }

      const isEmpty = this.poPaymentList
        .filter(po => !!po.poNumber && po.amount && po.companyName && po.records && !po.error).length === 0
      const hasInvalidPos = this.poPaymentList.filter(po => !!po.error).length > 0
      const exceedMaxPos = this.totalPos > this.MAX_POS
      const exceedMaxBls = this.totalBls > this.MAX_BLS
      const exceedMaxBankAmount = this.totalAmount > this.country.defaultCurrency.bankMaxAmount
      if (isEmpty || hasInvalidPos || exceedMaxPos || exceedMaxBls || exceedMaxBankAmount) {
        return false
      }

      return true
    }
  },

  mounted () {
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  beforeDestroy () {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },

  watch: {
    country: {
      handler () {
        if (!this.country) {
          return
        }
        this.setInitialPoList()
      },
      immediate: true
    },

    createdPaymentTransaction: {
      handler () {
        this.hasChangedData = false
      }
    }
  },

  methods: {
    ...mapActions({
      setGlobalError: 'application/setError',
      clearGlobalError: 'application/clearError',
      setCreatedPO: 'purchaseOrder/setCreatedPO',
      setGlobalPaymentGatewayMethod: 'application/setPaymentGatewayMethod'
    }),

    async triggerRouterGuard () {
      this.openNavigationModal()
      return new Promise((resolve) => {
        this.navigationDialogEventBus.$on('cancelNavigate', () => {
          this.closeNavigationModal()
          resolve(false)
        })

        this.navigationDialogEventBus.$on('confirmNavigate', () => {
          this.closeNavigationModal()
          resolve(true)
        })
      })
    },

    handleCancelNavigation () {
      this.navigationDialogEventBus.$emit('cancelNavigate')
    },

    handleConfirmNavigation () {
      this.navigationDialogEventBus.$emit('confirmNavigate')
    },

    openNavigationModal () {
      this.isOpenModalNavigation = true
    },

    closeNavigationModal () {
      this.isOpenModalNavigation = false
    },

    handleConfirmChangeFlag () {
      this.isChangingFlag = true
    },

    handleBeforeUnload (e) {
      // Let QR Code Page handles the check
      if (this.$refs.paymentGateway) {
        return
      }

      /**
       * DO NOT PREVENT UNLOAD IF
       * - Data has not been changed
       * - Flag has been changed
       */
      if (!this.hasChangedData || this.isChangingFlag) {
        return
      }

      e.preventDefault()
      e.returnValue = ''
    },

    handleUpdatePoNumber (po, newNumber) {
      let updatingData = {
        ...po,
        poNumber: newNumber
      }
      if (po.poNumber !== newNumber) {
        // Changing PO number, clear all information
        updatingData = this.clearPOInformation(updatingData)
      }
      this.poPaymentList = this.poPaymentList.map(currentPo => {
        return currentPo.no === po.no
          ? {
            ...currentPo,
            ...updatingData
          }
          : currentPo
      })
    },

    clearPOInformation (po) {
      return {
        ...po,
        amount: null,
        companyName: null,
        payStatus: null,
        records: null
      }
    },

    setInitialPoList () {
      this.poPaymentList = initRowData(5, this.currencyCode)

      if (this.createdPO) {
        this.hasChangedData = true
        this.fillPoInformation(this.poPaymentList[0].no, this.createdPO)
      }

      this.$watch(
        'poPaymentList',
        () => { this.hasChangedData = true },
        { deep: true, immediate: false }
      )
    },

    removePO (no) {
      this.hasChangedData = true
      this.poPaymentList = this.poPaymentList.filter(
        currentPo => currentPo.no !== no
      )
    },

    handleRemovePO (po) {
      this.removePO(po.no)
      this.validateAndFillAllPos()
    },

    addPO () {
      this.hasChangedData = true
      this.poPaymentList.push(initPO(this.currencyCode))
    },

    validateAndFillAllPos () {
      this.poPaymentList
        .filter(po => !!po.poNumber)
        .forEach(po => {
          this.validatePo(po.no)
          if (!po.amount) {
            this.fetchPoInformation(po.no)
          }
        })
    },

    validatePo (no) {
      this.setPOItemError(no, null)
      this.validatePoNumber(no)

      this.clearDuplicatedErrors()
      this.validateDuplicatedPoNumbers()
    },

    handlePoNumberInputBlur (po) {
      this.hasChangedData = true
      if (po.poNumber) {
        this.setPOItemData(po.no, {
          poNumber: po.poNumber.trim()
        })
      }

      this.validatePo(po.no)

      this.clearDuplicatedErrors()
      this.validateDuplicatedPoNumbers()

      this.poPaymentList.forEach(poItem => {
        if (poItem.poNumber) {
          this.fetchPoInformation(poItem.no)
        }
      })
    },

    async fetchPoInformation (no) {
      const po = this.getPOItem(no)
      if (!po.error) {
        try {
          this.isCreatingPayment = true

          let poInformation
          const cachedPoInformation = this.cachedPaidPOInforByNumbers[po.poNumber]

          if (cachedPoInformation) {
            poInformation = cachedPoInformation
          } else {
            poInformation = await PurchaseOrderRepo.getOne(po.poNumber, {
              countryCode: this.country.code
            })
          }

          if (poInformation.payStatus === PO_PAY_STATUS.YES) {
            this.cachedPaidPOInforByNumbers[poInformation.poUid] = poInformation
          }

          if (!poInformation) {
            this.setPOItemError(no, PO_NUMBER_ERRORS('PO_NUMBER_DOES_EXIST', this.countryCode))
            return
          }

          if (poInformation.payStatus === PO_PAY_STATUS.YES) {
            this.setPOItemError(no, PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', this.countryCode))
            return
          }

          this.fillPoInformation(po.no, poInformation)
        } catch (error) {
          this.setPOItemError(no, PO_NUMBER_ERRORS('PO_NUMBER_DOES_EXIST', this.countryCode))
          this.isCreatingPayment = false
        } finally {
          this.isCreatingPayment = false
        }
      }
    },

    fillPoInformation (no, poInformation) {
      this.setPOItemData(no, {
        poNumber: poInformation.poUid,
        amount: this.numberFormatter(
          this.country.defaultCurrency.thousandSeparator,
          this.country.defaultCurrency.decimalPlaces,
          poInformation.poAmount
        ),
        payStatus: poInformation.payStatus || null,
        companyName: poInformation.companyName,
        records: poInformation.totalBlInv,
        currency: poInformation.currency
      })
    },

    setPOItemData (no, data = {}) {
      this.poPaymentList = this.poPaymentList.map(
        po => po.no === no ? { ...po, ...data } : { ...po }
      )
    },

    setPOItemError (no, error) {
      this.poPaymentList = this.poPaymentList.map(
        po => po.no === no ? { ...po, error } : po
      )
    },

    getPOItem (no) {
      return {
        ...(this.poPaymentList.filter(po => po.no === no)[0] || {})
      }
    },

    validatePoNumber (no) {
      const po = this.getPOItem(no)
      const error = validatePoNumber(po, this.country.code)
      if (error) {
        this.setPOItemError(no, error)
        return
      }
      this.setPOItemError(no, null)
    },

    clearDuplicatedErrors () {
      function hasDuplicatedError (po, countryCode) {
        return po.error && po.error.type === PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', countryCode).type
      }

      this.poPaymentList.forEach(po => {
        if (hasDuplicatedError(po, this.countryCode)) {
          this.setPOItemError(po.no, null)
        }
      })
    },

    validateDuplicatedPoNumbers () {
      const posByNumber = this.poPaymentList.reduce((result, po) => {
        let shouldCheckDuplicatePO = true
        if (po.error) {
          if (!isValidPoFormat(po.error.type, this.countryCode)) {
            shouldCheckDuplicatePO = false
          }
        }
        if (po.poNumber && shouldCheckDuplicatePO) {
          return {
            ...result,
            [po.poNumber]: [...(result[po.poNumber] || []), po]
          }
        }

        return result
      }, {})

      Object.keys(posByNumber).forEach(poKey => {
        const pos = posByNumber[poKey]

        if (pos.length <= 1) {
          return
        }

        pos.forEach(po => {
          this.setPOItemError(po.no, PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', this.countryCode))
        })
      })
    },

    openModalProceedToPay () {
      this.isOpenModalProceedToPay = !this.isOpenModalProceedToPay
    },

    async handleConfirmProceedToPay () {
      try {
        const payCountry = this.country.code
        const poList = this.poPaymentList.map(po => po.poNumber).filter(poNumber => poNumber)
        this.isOpenModalProceedToPay = false
        this.isCreatingPayment = true
        this.createdPaymentTransaction = await paymentTransactions.create({ payCountry, poList })
        if (this.createdPaymentTransaction.redirectLink) {
          this.setGlobalPaymentGatewayMethod(this.paymentGatewayMethodEnum.PAGE_REDIRECT)
          await this.redirectToPaymentGatewayOfBank(this.createdPaymentTransaction.redirectLink)
          setTimeout(() => {
            this.isCreatingPayment = false
          }, 1000)
          return
        }
        this.isCreatingPayment = false
        this.scrollToTop()
      } catch (e) {
        this.isCreatingPayment = false
        this.isOpenModalProceedToPay = false
        const { data, status } = e
        this.handleErrorProceedToPay(data, status)
      }
    },
    handleDiscardProceedToPay () {
      this.isOpenModalProceedToPay = !this.isOpenModalProceedToPay
    },

    handleErrorProceedToPay (responseError, status) {
      if (status === 400) {
        const { errors } = responseError
        if (Array.isArray(errors) && errors.length > 0) {
          for (const index in errors) {
            const { field, code } = errors[index]
            const _poNumber = handlePayPOErrors.getfield(field)
            const _poNumberError = handlePayPOErrors.mappingPayPOError(code, this.countryCode)
            this.mapErrorToPoPaymentList(_poNumber, _poNumberError)
          }
        }
      } else {
        this.setGlobalError({
          title: 'Something went wrong',
          message: 'Could not complete the operation due to network problem'
        })
      }
    },

    mapErrorToPoPaymentList (_poNumber, _poNumberError) {
      this.poPaymentList
        .filter(({ poNumber }) => poNumber === _poNumber)
        .forEach(poItem => {
          if (PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', this.countryCode).type === _poNumberError.type) {
            poItem.payStatus = PO_PAY_STATUS.YES
          }
          poItem.error = _poNumberError
        })
    },

    async retryTransaction (transactionUid) {
      try {
        this.isRetryingTransaction = true
        const newTransaction = await paymentTransactions.retry(transactionUid)
        this.createdPaymentTransaction = null
        this.createdPaymentTransaction = newTransaction
        this.isRetryingTransaction = false
        this.scrollToTop()
      } catch (error) {
        this.isRetryingTransaction = false
        this.setGlobalError({
          title: 'Something went wrong',
          message: 'Could not complete the operation due to network problem'
        })
      }
    },

    handleNewPayment () {
      this.setCreatedPO(null)
      this.createdPaymentTransaction = null
      this.poPaymentList = []
      this.setInitialPoList()
    },

    scrollToTop () {
      window.scrollTo(0, 0)
    },

    getTextByCountry,

    async redirectToPaymentGatewayOfBank (redirectLink) {
      const redirectLinkReplace = redirectLink.replace(/"/g, '\'')
      this.pageRedirectForm = redirectLinkReplace
      await this.$nextTick()
      document.getElementById('pay_form').submit()
    }
  }
}
</script>
