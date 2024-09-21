<template>
<Layout
  :hasChangedData="hasChangedData"
  :openModalChangeCountry.sync="isOpenModalChangeCountry"
  @confirmChangeFlag="handleConfirmChangeFlag"
>
  <section class="content ep__main_content pt-80">
    <div class="container">
      <div class="tab-content" id="myTabContent">
        <FloatingError :floatingErrors="floatingErrors"/>
        <!-- Create PO Tab -->
        <div class="tab-pane fade show active" id="createPO" role="tabpanel">
          <div class="content__title">
          {{ this.getDisplayText('createPOPage_poTitleText') }}
          </div>

        <PayerInformationForm
          :countryCode="countryCode"
          :companyName.sync="companyName"
          :email.sync="email"
          :contactNumber.sync="contactNumber"
          :errors="msg"
          :contactInfo="countryContact"
          :readonlyMode="readonlyMode"
          @companyNameBlur="validateCompanyName"
          @emailBlur="validateEmail"
          @contactNumberBlur="validateContactNumber"
          @contactNumberKeypress="restrictOnlyNumber"
          @switchCountryContact="getCountryContact"
        />

        <!-- PO Info -->
        <!-- PO Info Title -->
        <div v-if="this.country" class="d-flex justify-content-end ml-auto">
          <a class="mr-8" data-testid="linkDownload" :href="getDownloadLinkTemplate" target="_blank" :disabled="readonlyMode">
            <button
              type="button"
              data-toggle=""
              data-target="#downloadTemplate"
              class="btn p-8-12 btn__up-down btn--sm-scr"
              :disabled="readonlyMode"
            >
              <img src="../../../static/img/download.svg" class="mr-8" alt="download" :class="{'prevent-pointer-events' : readonlyMode}">
              Download template
            </button>
          </a>
          <batch-upload v-on:bl_list_update='blListDataHandling' :isDisable="readonlyMode"/>
        </div>
        <div class="po-content">
          <div class="content__frame__header br-bt mb-8 pb-8">
            <div class="row m-0">
              <div class="col-md-4 col-lg-4 p-0">
                <div class="d-flex">
                  <div class="ordinal-no">
                      <label class="form__label mb-0">{{this.getDisplayText('createPOPage_poContent_po_label_BillOfLadingNo')}}
                      <br/>
                        <span v-if="countryCode === 'id' || countryCode === 'th'">
                        <span class="form__label-break-line">({{this.getDisplayText('createPOPage_poContent_po_label_Maximum')}} </span> per {{ this.getDisplayText('createPOPage_poContent_po_label')}})
                      </span>
                      <span v-else>
                        ({{this.getDisplayText('createPOPage_poContent_po_label_Maximum')}} per {{this.getDisplayText('createPOPage_poContent_po_label')}})
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-4 form__label-align-bottom pl-0">
                <div class="row m-0">
                  <div class="col-md-5 col-lg-4 p-0">
                      <div class="pl-32"><label class="form__label mb-0">Currency</label>
                      </div>
                  </div>
                  <div class="col-md-7 col-lg-8 p-0">
                      <div class="text-right"><label class="form__label mb-0">Amount</label>
                      </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-4 form__label-align-bottom pr-0">
                <div><label class="form__label mb-0">Remark</label>
                </div>
              </div>
            </div>
        </div>
      </div>
        <!-- End PO Info Title -->

        <!-- PO Info Content -->
        <div data-testid="bl-row" class="po-content" v-for="(bl, index) in blList" :key="bl.no">
          <div
            class="content__frame createpo__page mb-12 p-24">
            <div class="row m-0">
              <div class="col-md-4 col-lg-4 p-0">
                <div class="row ml-0">
                  <div class="numerical-order-oney align-items-center txt-black pl-0 pr-0 d-flex">
                    <span class="numerical-order">{{`${index + 1}.`}}</span>
                    <span class="form__txtCurrency">ONEY</span>
                  </div>
                  <div class="col d-flex w-100">
                    <input
                      type="text"
                      class="form__control"
                      v-bind:style="[bl.numberError ? { 'border': '1px solid #FF0000 !important', 'background': '#F5DBDC !important', 'box-sizing': 'border-box', 'border-radius': '5px', '-webkit-box-shadow': '0 0 0 100px #F5DBDC inset !important'} : { }]"
                      v-model="bl.number"
                      name="number"
                      @blur="handleBlNumberInputBlur(bl)"
                      :class="{'error-controls': !!bl.numberError, 'disable-color-input': readonlyMode}"
                      :placeholder="getDisplayText('createPOPage_poInforContent_numberInput_placeHolder')"
                      maxlength="16"
                      aria-label="BL number"
                      :disabled="readonlyMode"
                      data-testid="blnumber"
                    >
                  </div>
                  <div class="w-100"></div>
                  <div class="numerical-order-oney align-items-center pr-16 txt-black pl-0 d-flex"></div>
                  <div class="col d-flex w-100">
                    <div :data-testid="`bl-number-error-${index}`" class="content__feedback" v-if="bl.numberError">
                      {{ bl.numberError ? bl.numberError.message : '' }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-lg-4 pl-0">
                <div class="row m-0">
                  <div class="col-md-5 col-lg-4 p-0">
                    <div class="d-flex align-items-center h-100 form__txtCurrency">
                      <span aria-label="BL currency" class="w-100 pl-32" :class="{ 'disable-color-input--pink': readonlyMode }">{{ bl.currency }}</span>
                    </div>
                  </div>
                  <div class="col-md-7 col-lg-8 p-0">
                    <input
                        type="text"
                        v-model="bl.amount"
                        name="amount"
                        class="form__control form__txtAmount po-amount"
                        placeholder="Please input amount"
                        aria-label="BL amount"
                        :maxlength="maxLengthAmountDisplay"
                        :class="{'error-controls': !!bl.amountError, 'disable-color-input--pink': readonlyMode}"
                        @blur="validateBLAmount(bl)"
                        @keydown="restrictOnlyAmountOnKeydown($event, bl)"
                        @keypress="restrictOnlyAmountOnKeypress($event, bl)"
                        :disabled="readonlyMode"
                        data-testid="blamount"
                      >
                  </div>
                  <div class="w-100"></div>
                  <div class="col-md-5 col-lg-4 p-0"></div>
                  <div class="col-md-7 col-lg-8 p-0">
                    <div
                        :data-testid="`bl-amount-error-${index}`"
                        class="content__feedback" v-if="bl.amountError"
                      >
                        {{ bl.amountError ? bl.amountError.message : '' }}
                      </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-g-4 pr-0">
                <div class="d-flex flex-column">
                  <div class="d-flex">
                    <input
                      type="text"
                      v-model="bl.remark"
                      @blur="validateBLRemark(bl)"
                      :class="{'error-controls': bl.remarkError, 'disable-color-input': readonlyMode}"
                      class="form__control"
                      placeholder="Please input, if any"
                      maxlength="2000"
                      aria-label="BL remark"
                      :disabled="readonlyMode"
                      data-testid="blremark"
                    >
                    <ep-icon-button
                      data-testid="bl-remove-button"
                      class="d-flex form__delete b-row-remove-icon p-0"
                      @click="removeBl(index)"
                      :disabled="readonlyMode"
                    >
                      <delete-icon />
                    </ep-icon-button>
                  </div>
                  <div :data-testid="`bl-remark-error-${index}`" class="content__feedback" v-if="bl.remarkError">
                    {{ bl.remarkError ? bl.remarkError.message : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End PO Info Content -->
        </div>

        <!-- Add Row Button -->
        <div class="d-flex justify-content-end mb-48">
            <div data-testid="error-max-bl" class="content__feedback" v-if="this.blList.length === this.maxAllowBL">{{ this.getDisplayText('createPOPage_poContent_maxBLsRecord_errorMsg') }}</div>
            <button
              data-testid="bl-add-button"
              type="button"
              class="btn btn__add d-flex add-row p-0"
              @click="addBl()"
              :disabled="this.blList.length === this.maxAllowBL || readonlyMode"
            >
              <img src="../../../static/img/plus.svg" alt="Add" />
            </button>
        </div>
        <!-- End Add Row Button -->

        <!-- PO Additional Info -->
        <div class="content__frame mb-16">
            <div class="row ml-0 mr-0">
                <div class="col-lg-4 col-5 pl-0 pr-0">
                    <div class="content__address p-24 h-100 d-flex flex-column">
                        <label class="mb-16 txt-14"><span class="txt-16-b txt-black text-uppercase">Receivable office</span> <br />(Payment will be made to below office)</label>
                        <div class="align-items-end justify-content-end mt-auto">
                            <label class="txt-16-b txt-pink text-uppercase mb-0" data-testid="receivable-office-name">{{ this.defaultReceivableOffice.officeName || '' }}</label>
                            <label class="txt-black mb-0">Address: <span class="txt-gray" data-testid="receivable-office-address" v-html="this.defaultReceivableOffice.address || ''"></span></label>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8 col-7 d-flex flex-column total-area">
                    <TotalAmount :totalAmount="totalAmount" :countryCode="countryCode" :errorFn="(max, exceed, currency) => getTextByCountry(this.countryCode, 'createPOpage_maxAmount_uploadFile_errorMsg_reachedMax', [max, exceed, currency])"/>

                    <div class="pt-24">
                        <div class="row d-flex">
                            <div class="col-xxl-7 justify-content-end align-items-end">
                                <input type="text"
                                  class="auto-field"
                                  :class="{'po-number-auto-field': readonlyMode}"
                                  :placeholder="this.getDisplayText('createPOPage_poNumberAutoGenerate_textbox_placeHolder')"
                                  v-model="createdPONumber"
                                  disabled>
                            </div>
                            <div class="col-xxl-5 d-flex justify-content-end align-items-end">
                                <div class="d-flex h-100">
                                    <ep-button
                                      v-if="readonlyMode"
                                      data-testid="proceed-to-pay-button"
                                      class="mr-16 btn-size submit-button"
                                      @click="handleProceedToPayButtonClicked"
                                    >
                                      Proceed to Pay
                                    </ep-button>
                                    <ep-button
                                      v-else
                                      data-testid="save-and-proceed-to-pay-button"
                                      class="mr-16 submit-button"
                                      :disabled="!canProceedToPay"
                                      @click="handleSaveAndProceedToPayButtonClick"
                                    >
                                      Save and Proceed to Pay
                                    </ep-button>
                                    <ep-button
                                      type="button"
                                      :disabled="!canProceedToPay || readonlyMode"
                                      class="btn btn--main btn--blue btn--sm-scr save-btn submit-button"
                                      v-bind:class="{['btn--blue--disable']: !canProceedToPay || readonlyMode}"
                                      @click="handleSaveAndEmailButtonClick"
                                      data-testid="save-and-email-button"
                                      >
                                      Save and Email
                                    </ep-button>
                                </div>
                                <!-- Save and Email Modal -->
                                <div class="modal fade" id="saveModalOnCreate" tabindex="-1"
                                    aria-labelledby="saveModal" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-body p-32">
                                                <label class="txt-center mb-24"> {{this.getDisplayText('createPOPage_poCreation_successfullyPopup_text')}} <span class="txt-pink txt-bold">{{ createdPONumber }}</span> has been created and sent to your email. Do you want to create a new one?</label>
                                                <div class="row">
                                                    <div class="col-6">
                                                        <a href="#" type="button"
                                                            class="btn btn--md btn--pink btn--sm-scr w-100">Create a New One</a>
                                                    </div>
                                                    <div class="col-6">
                                                        <button type="button"
                                                            class="btn btn--md btn--blue btn--sm-scr w-100"
                                                            data-dismiss="modal">View Details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- End Save and Email Modal -->

                                <!-- Save and Email Btn Clicked Again -->
                                <div class="modal fade" id="saveModalOnCreateAgain" tabindex="-1"
                                    aria-labelledby="saveModal" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-body p-32 d-flex flex-column align-items-center">
                                                <label class="txt-center mb-24">{{this.getDisplayText('createPOPage_poCreation_sentToEmailSuccess_text')}}</label>
                                                <button type="button" class="btn btn--md btn--pink btn--sm-scr btn--md" data-dismiss="modal">OK</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- End Save and Email Btn Clicked Again -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End PO Additional Info -->

        <!-- Save and Email Modal -->
        <div
          class="modal fade"
          id="saveModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="saveModal"
          aria-hidden="true">
          <div
            class="modal-dialog modal-dialog-centered"
            role="document">
            <div class="modal-content">
              <div class="modal-body d-flex flex-column align-items-center m-auto mt-32">
                <img
                  class="img-128"
                  src="../../../static/img/Email.svg"
                  alt="">
                <p class="txt-center txt-24 txt-black mt-32">{{this.getDisplayText('createPOPage_saveAndEmail_button_notice')}}</p>
              </div>
              <div class="modal-footer d-flex align-self-center bd-t-none mb-32">
                <button
                  type="button"
                  class="btn btn--pd70 btn--pink"
                  data-bs-dismiss="modal">OK</button>
              </div>
            </div>
          </div>
        </div>
        <!-- End Save and Email Modal -->
        </div>
      </div>
      <!-- End PO Additional Info -->
      <!-- End PO Info -->

    </div>
    </section>
    <DialogConfirmNavigation
      :isOpen="isOpenModalNavigation"
      :closeOnClickOutside="false"
      @discard="handleCancelNavigation"
      @confirm="handleConfirmNavigation"
    />
    <Loading :isRequesting="isCreatingPO" />
    <DialogPOCreated
      :countryCode="countryCode"
      :isOpen="isOpenCreatedPODialog"
      :poNumber="createdPONumber || ''"
      @createNewOne="handleCreateNewOne"
      @viewDetails="activeViewOnlyMode"
    />
</Layout>

  <!-- End Content -->
</template>

<style>
  @import '../../../static/css/style.css';
</style>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import DialogPOCreated from '@/components/dialog/DialogPOCreated.vue'
import BatchUpload from './components/BatchUpload.vue'
import EpIconButton from '@/components/EpIconButton.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import EpButton from '@/components/EpButton.vue'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import * as PurchaseOrders from '@/repositories/PurchaseOrders'
import FloatingError from '@/components/FloatingError.vue'
import { areValidBls, isEmptyBl } from './utils/bl'
import * as createPOMappers from './mappers/create-po'
import Loading from '@/components/Loading.vue'
import { validateEmail } from './services/validateEmail'
import { validateCompanyName } from './services/validateCompanyName'
import { validateContactNumber } from './services/validateContactNumber'
import { validateBLNumber } from './services/validateBLNumber'
import { validateBLAmount } from './services/validateBLAmount'
import { validateBLRemark } from './services/validateBLRemark'
import { initRowData, initBL } from './services/blList.js'
import { detectFloatingErrors } from './services/floatingErrors.js'
import { convertToNumber, calculateAmount } from './services/totalAmount.js'
import * as handleCreatePOErrors from './services/create-po/handle-error'
import PayerInformationForm from './components/PayerInformationForm.vue'
import TotalAmount from '@/components/TotalAmount.vue'
import Layout from '@/components/Layout.vue'
import DialogConfirmNavigation from '@/components/dialog/DialogConfirmNavigation.vue'
import { settingsMixin } from '@/mixins/settings-mixin'
import { getTextByCountry } from '@/utils/displayTextResources'
import { META_DESCRIPTION, META_DESCRIPTION_DEFAULT_PROP, MAX_RECORDS_BL } from '@/utils/constants'

export default {
  metaInfo: {
    meta: [{
      ...META_DESCRIPTION_DEFAULT_PROP,
      content: META_DESCRIPTION.CREATE_PO
    }]
  },
  name: 'CreatePO',

  components: {
    BatchUpload,
    EpIconButton,
    DeleteIcon,
    FloatingError,
    EpButton,
    Loading,
    PayerInformationForm,
    TotalAmount,
    Layout,
    DialogConfirmNavigation,
    DialogPOCreated
  },

  props: {
    countryCode: {
      type: String,
      default: 'SG'
    }
  },

  mixins: [settingsMixin],

  data () {
    return {
      companyName: '',
      email: '',
      contactNumber: '',
      msg: {
        emailError: '',
        companyNameError: '',
        contactNumberError: ''
      },
      blList: [],
      blListInvalidMessage: '',
      maxAllowBL: MAX_RECORDS_BL,
      totalAmount: 0,
      floatingErrors: [],
      charCode: '',
      decimalCharacter: '',
      isCreatingPO: false,
      hasChangedData: false,
      countryContact: {
        urlImage: require('../../../static/img/flag-sg.svg'),
        isoCode: 'SG',
        countryCode: '+65',
        countryName: 'Singapore'
      },
      /** should get this data from server - update later on */
      listCountryContact: [
        {
          urlImage: require('../../../static/img/flag-sg.svg'),
          isoCode: 'SG',
          countryCode: '+65',
          countryName: 'Singapore'
        },
        {
          urlImage: require('../../../static/img/flag-hk.svg'),
          isoCode: 'HK',
          countryCode: '+852',
          countryName: 'Hong Kong'
        },
        {
          urlImage: require('../../../static/img/flag-macau.svg'),
          isoCode: 'MO',
          countryCode: '+853',
          countryName: 'Macau'
        },
        {
          urlImage: require('../../../static/img/flag-china.svg'),
          isoCode: 'CN',
          countryCode: '+86',
          countryName: 'China'
        },
        {
          urlImage: require('../../../static/img/flag-id.svg'),
          isoCode: 'ID',
          countryCode: '+62',
          countryName: 'Indonesia'
        },
        {
          urlImage: require('../../../static/img/flag-th.svg'),
          isoCode: 'TH',
          countryCode: '+66',
          countryName: 'Thailand'
        }
      ],
      isOpenModalNavigation: false,
      isOpenCreatedPODialog: false,
      createdPONumber: null,
      readonlyMode: false,
      isOpenModalChangeCountry: false,
      isChangingFlag: false
    }
  },

  computed: {
    maxTotalAmount () {
      if (!this.country || !this.country.defaultCurrency) {
        return 0
      }

      return this.country.defaultCurrency.bankMaxAmount
    },

    getDownloadLinkTemplate () {
      if (!this.country || !this.country.defaultCurrency) {
        return
      }
      return `${window.location.origin}/${this.country.defaultCurrency.fileNameTemplateImport}?v=${Date.now()}`
    },

    isTotalAmountExceedMax () {
      return this.totalAmount > this.maxTotalAmount
    },

    currencyCode () {
      if (!this.country || !this.country.defaultCurrency) {
        return ''
      }
      return this.country.defaultCurrency.code
    },

    canProceedToPay () {
      const hasValidCompanyName = !!this.companyName && !this.msg.companyNameError
      const hasValidEmail = !!this.email && !this.msg.emailError
      const hasValidContactNumber = !!this.contactNumber && !this.msg.contactNumberError

      const filledBls = this.blList.filter(bl => !isEmptyBl(bl))
      const hasAtLeast1ValidBl = filledBls.length && areValidBls(filledBls)
      const doesNotExceedMaxTotalAmount = !this.isTotalAmountExceedMax

      return hasAtLeast1ValidBl &&
        doesNotExceedMaxTotalAmount &&
        hasValidCompanyName &&
        hasValidEmail &&
        hasValidContactNumber
    },

    defaultReceivableOffice () {
      if (!this.country || !this.country.defaultReceivableOffice) {
        return {}
      }
      return this.country.defaultReceivableOffice
    },

    maxLengthAmountWholeNumberPart () {
      if (this.country && this.country.defaultCurrency && this.country.defaultCurrency.bankMaxAmount) {
        return parseInt(this.country.defaultCurrency.bankMaxAmount).toString().length
      }

      return 0
    },

    maxLengthAmountDisplay () {
      if (this.country && this.country.defaultCurrency) {
        const decimalPlaces = this.country.defaultCurrency.decimalPlaces
        const numberOfThousandsCharactersMax = this.maxLengthAmountWholeNumberPart % 3 > 0 ? this.maxLengthAmountWholeNumberPart / 3 : (this.maxLengthAmountWholeNumberPart / 3) - 1
        return decimalPlaces === 0 ? this.maxLengthAmountWholeNumberPart + numberOfThousandsCharactersMax : this.maxLengthAmountWholeNumberPart + numberOfThousandsCharactersMax + decimalPlaces + 1
      }

      return 0
    }
  },

  watch: {
    country: {
      handler () {
        if (!this.country) {
          return
        }
        this.setInitialBlList()
        this.setCountryContact(this.country.code)
        if (this.country.defaultCurrency) {
          if (this.country.defaultCurrency.thousandSeparator === '.') {
            this.charCode = 44
            this.decimalCharacter = ','
          } else if (this.country.defaultCurrency.thousandSeparator === ',') {
            this.charCode = 46
            this.decimalCharacter = '.'
          }
          if (this.country.defaultCurrency.decimalPlaces === 0) {
            this.charCode = undefined
          }
        }
      },
      immediate: true
    },
    companyName: {
      handler () {
        this.hasChangedData = true
      },
      immediate: false
    },
    email: {
      handler () {
        this.hasChangedData = true
      },
      immediate: false
    },
    contactNumber: {
      handler () {
        this.hasChangedData = true
      },
      immediate: false
    }
  },

  created () {
    this.navigationDialogEventBus = new Vue()
    this.ErrorMessage = ErrorMessage
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  async beforeRouteLeave (to, from, next) {
    if (from.path === to.path) {
      next()
      return
    }

    const handleNavigationGuard = async () => {
      const shouldNavigate = await this.triggerRouterGuard()
      if (shouldNavigate) {
        next(true)
        this.clearGlobalError()
      } else {
        next(false)
      }
    }

    if (this.isSubmittingData) {
      next()
      return
    }

    if (this.readonlyMode) {
      await handleNavigationGuard()
      return
    }

    if (
      this.isOpenCreatedPODialog ||
      !this.hasChangedData
    ) {
      next()
      return
    }

    await handleNavigationGuard()
  },

  beforeDestroy () {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },

  methods: {
    ...mapActions({
      setCreatedPO: 'purchaseOrder/setCreatedPO',
      setGlobalError: 'application/setError',
      clearGlobalError: 'application/clearError',
      generateAccessToken: 'authenticator/generateAccessToken'
    }),
    getTextByCountry,
    openNavigationModal () {
      this.isOpenModalNavigation = true
    },

    closeNavigationModal () {
      this.isOpenModalNavigation = false
    },

    handleConfirmChangeFlag () {
      this.isChangingFlag = true
    },

    async handleBeforeUnload (e) {
      if (this.isChangingFlag) {
        return
      }

      if (this.readonlyMode) {
        e.preventDefault()
        e.returnValue = ''
        return
      }

      /**
       * DO NOT PREVENT UNLOAD IF
       * - Data has not been changed
       * - Created PO dialog is open
       * - Flag has been changed
       */
      if (!this.hasChangedData || this.isOpenCreatedPODialog) {
        return
      }

      e.preventDefault()
      e.returnValue = ''
    },

    setInitialBlList () {
      this.blList = initRowData(5, this.currencyCode)
      this.$watch(
        'blList',
        () => { this.hasChangedData = true },
        { deep: true, immediate: false }
      )
    },

    setCountryContact (countryCode) {
      this.countryContact = this.listCountryContact.find(ele => ele.isoCode === countryCode)
    },

    goToPayPOPage () {
      this.$router.push('/' + this.countryCode + '/pay-po').catch(() => { /* istanbul ignore next */ })
    },

    async handleSaveAndProceedToPayButtonClick () {
      try {
        this.isCreatingPO = true
        const createdPO = await this.createPurchaseOrder()
        this.setCreatedPO(createdPO)
        this.isCreatingPO = false
        this.isSubmittingData = true
        this.goToPayPOPage()
      } catch (error) {
        this.isCreatingPO = false
        this.handleCreatePOApiError(error)
      }
    },

    async handleSaveAndEmailButtonClick () {
      try {
        this.isCreatingPO = true
        const createdPO = await this.createPurchaseOrder()
        this.createdPONumber = createdPO.poUid
        this.isCreatingPO = false
        this.openCreatedPODialog()
        this.setCreatedPO(createdPO)
      } catch (error) {
        this.isCreatingPO = false
        this.handleCreatePOApiError(error)
      }
    },

    createPurchaseOrder () {
      const createPOData = createPOMappers.toCreatePoData(
        {
          blList: this.blList,
          companyName: this.companyName,
          email: this.email,
          contactNumber: this.contactNumber,
          areaCode: this.countryContact.countryCode,
          countryCode: this.country.code
        },
        {
          convertAmountToNumber: amount => convertToNumber(amount, this.country.defaultCurrency.thousandSeparator)
        })
      return PurchaseOrders.create(createPOData)
    },

    handleCreatePOApiError (error) {
      const errorsField = error.errors || error.message
      if (Array.isArray(errorsField) && errorsField && errorsField.length) {
        const shouldShowGeneralErrorModal = errorsField.filter((err) => !err.field).length
        if (shouldShowGeneralErrorModal) {
          this.setGlobalError({
            title: 'Something went wrong',
            message: 'Could not complete the operation due to network problem'
          })
          return
        }

        // Trigger all validations again
        this.triggerAllValidations()
        this.handleBlNumberNotFoundErrors(errorsField)
      } else {
        this.setGlobalError({
          title: 'Something went wrong',
          message: 'Could not complete the operation due to network problem'
        })
      }
    },

    handleBlNumberNotFoundErrors (errors) {
      const blNotExistsErrors = errors
        .filter(err => err.code === 'BL_INVOICE_NUMBER_IS_NOT_EXISTED')

      if (blNotExistsErrors.length) {
        const extractedFields = blNotExistsErrors
          .map(err => handleCreatePOErrors.extractField(err.field))
        const blNumberFields = extractedFields
          .filter(field => field.type === 'BL_ERROR' && field.field === 'number')
        const blNumbers = blNumberFields.map(field => field.number)

        this.blList
          .filter(({ number }) => blNumbers.indexOf(number) !== -1)
          .forEach(bl => {
            bl.numberError = this.errorMessageByCountry.BL_NUMBER_ERRORS.NotExists
          })

        this.collectFloatingErrors()
      }
    },

    triggerAllValidations () {
      this.validateCompanyName()
      this.validateEmail()
      this.validateContactNumber()
      this.blList
        .filter((bl) => !!bl.number || !!bl.amount || !!bl.remark)
        .forEach((bl) => {
          this.validateBLNumber(bl)
          this.validateBLAmount(bl)
          this.validateBLRemark(bl)
        })
      this.validateDuplicatedBlNumbers()
    },

    blListDataHandling: function (data) {
      this.blList = []
      this.blListInvalidMessage = ''
      this.blList = data

      // Data validation
      for (const blItem of this.blList) {
        this.validateBLNumber(blItem)
        this.validateBLAmount(blItem)
        this.validateBLRemark(blItem)
      }

      this.validateDuplicatedBlNumbers()
    },

    calculateTotalAmount () {
      this.totalAmount = calculateAmount(this.country.defaultCurrency.decimalPlaces, this.blList, this.country.defaultCurrency.thousandSeparator)
    },

    removeBl: function (index) {
      this.blList.splice(index, 1)
      this.blListInvalidMessage = ''
      this.calculateTotalAmount()
      this.validateDuplicatedBlNumbers()
      this.collectFloatingErrors()
      this.hasChangedData = true
    },

    addBl: function () {
      if (this.blList.length === this.maxAllowBL) {
        this.blListInvalidMessage = this.getDisplayText('createPOPage_poContent_maxBLsRecord_errorMsg')
        return
      }
      this.blList.push(initBL(this.country.defaultCurrency.code))
      this.hasChangedData = true
    },

    collectFloatingErrors () {
      this.floatingErrors = detectFloatingErrors(this.blList)
      return this.floatingErrors
    },

    validateEmail: function () {
      this.hasChangedData = true
      this.email = this.email.trim()
      const error = validateEmail(this.email)
      this.msg.emailError = error
    },

    validateCompanyName: function () {
      this.hasChangedData = true
      this.companyName = this.companyName.trim()
      const error = validateCompanyName(this.companyName)
      this.msg.companyNameError = error
    },

    validateContactNumber: function () {
      this.hasChangedData = true
      this.contactNumber = this.contactNumber.trim()
      const error = validateContactNumber(this.contactNumber)
      this.msg.contactNumberError = error
    },

    handleBlNumberInputBlur (bl) {
      this.hasChangedData = true
      this.validateBLNumber(bl)
      this.validateDuplicatedBlNumbers()
    },

    validateBLNumber: function (bl) {
      bl.number = bl.number.trim()
      const error = validateBLNumber(bl.number, this.errorMessageByCountry)
      if (error && !this.readonlyMode) {
        bl.numberError = error
        return
      }
      bl.numberError = null
      this.collectFloatingErrors()
    },

    validateDuplicatedBlNumbers () {
      // Clear all duplicated errors first
      const blsWithDuplicatedError = this.blList
        .filter(bl => bl.numberError && bl.numberError.type === this.errorMessageByCountry.BL_NUMBER_ERRORS.Duplicated.type)

      blsWithDuplicatedError.forEach(bl => {
        bl.numberError = null
      })

      const blsByNumber = this.blList.reduce((result, bl) => {
        if (bl.number && !bl.numberError) {
          return {
            ...result,
            [bl.number]: [
              ...(result[bl.number] || []),
              bl
            ]
          }
        }

        return result
      }, {})

      Object.keys(blsByNumber).forEach(blKey => {
        const bls = blsByNumber[blKey]
        if (bls.length > 1) {
          bls.forEach(bl => {
            bl.numberError = this.errorMessageByCountry.BL_NUMBER_ERRORS.Duplicated
          })
        }
      })
      this.collectFloatingErrors()
    },

    validateBLAmount: function (bl) {
      this.hasChangedData = true
      const { error, amount } = validateBLAmount(bl.amount, this.country.defaultCurrency.thousandSeparator, this.country.defaultCurrency.decimalPlaces, this.decimalCharacter, this.maxTotalAmount, this.errorMessageByCountry)
      bl.amountError = this.readonlyMode ? null : error
      if (bl.amount || bl.amount === 0) {
        bl.amount = amount
      }

      this.collectFloatingErrors()
      this.calculateTotalAmount()
    },

    validateBLRemark (bl) {
      this.hasChangedData = true
      const error = validateBLRemark(bl.remark)
      bl.remarkError = this.readonlyMode ? null : error
      this.collectFloatingErrors()
    },
    restrictOnlyAmountOnKeydown: function (event, bl) {
      let editingPath = ''
      // Prevent user remove decimal character which may cause suspect cases
      // IE10: Delete event is 'Del'
      if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Del') {
        if (event.target.selectionStart === event.target.selectionEnd) {
          if (event.key === 'Backspace') {
            editingPath = bl.amount[event.target.selectionStart - 1]
          } else {
            editingPath = bl.amount[event.target.selectionStart]
          }
        } else {
          editingPath = bl.amount.slice(event.target.selectionStart, event.target.selectionEnd)
        }
      }

      if (editingPath === this.decimalCharacter) {
        const value = event.target.value.replace(new RegExp(`\\${this.country.defaultCurrency.thousandSeparator}`, 'g'), '')
        if (value.length > this.maxLengthAmountWholeNumberPart + 1) {
          event.preventDefault()
        }
      }
    },
    restrictOnlyAmountOnKeypress: function (event, bl) {
      this.hasChangedData = true
      // Only input number
      // charcode 46 = '.' || 44 = ','
      if ((event.which === this.charCode && bl.amount === '') ||
        (
          (event.which !== this.charCode || bl.amount.indexOf(this.decimalCharacter) !== -1 || bl.amount === this.decimalCharacter) &&
          ((event.which < 48 || event.which > 57) && (event.which !== 0 && event.which !== 8))
        )
      ) {
        event.preventDefault()
        return
      }

      // No susspect inputing values detected
      // Check for user inputing amount number is matched our template
      const editingPath = bl.amount.slice(event.target.selectionStart, event.target.selectionEnd)
      let afterEditingAmount = ''
      if (editingPath === '') {
        afterEditingAmount = bl.amount.substring(0, event.target.selectionStart) + event.key + bl.amount.substring(event.target.selectionStart)
      } else {
        afterEditingAmount = bl.amount.replace(editingPath, event.key)
      }
      // remove thousand separator
      afterEditingAmount = afterEditingAmount.replace(new RegExp(`\\${this.country.defaultCurrency.thousandSeparator}`, 'g'), '')
      const integral = afterEditingAmount.split(this.decimalCharacter)[0]
      let fractional = afterEditingAmount.split(this.decimalCharacter)[1]
      const decimalPlaces = this.country.defaultCurrency.decimalPlaces
      if (typeof fractional === 'undefined' && decimalPlaces !== 0) {
        fractional = '00'
      }
      let amountIsValidRegex
      let checkingValue

      if (decimalPlaces === 0) {
        amountIsValidRegex = new RegExp(`^\\d{0,${this.maxLengthAmountWholeNumberPart}}$`, 'g')
        checkingValue = integral
      } else {
        amountIsValidRegex = new RegExp(`^\\d{0,${this.maxLengthAmountWholeNumberPart}}\\${this.decimalCharacter}\\d{0,${decimalPlaces}}$`, 'g')
        checkingValue = integral + this.decimalCharacter + fractional
      }
      if (event.which !== this.charCode && !amountIsValidRegex.test(checkingValue)) {
        event.preventDefault()
      }
    },

    restrictOnlyNumber: function (event) {
      if ((event.which === this.charCode) || ((event.which < 48 || event.which > 57) && (event.which !== 0 && event.which !== 8))) {
        event.preventDefault()
      }
    },

    getCountryContact (countryCode) {
      this.setCountryContact(countryCode)
    },

    async triggerRouterGuard () {
      this.openNavigationModal()
      return new Promise((resolve) => {
        this.navigationDialogEventBus.$on('cancelNavigate', () => {
          this.closeNavigationModal()
          resolve(false)
        })

        this.navigationDialogEventBus.$on('confirmNavigate', () => {
          this.setCreatedPO(null)
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

    openCreatedPODialog () {
      this.isOpenCreatedPODialog = true
    },

    handleCreateNewOne () {
      this.setInitialBlList()
      this.totalAmount = 0
      this.createdPONumber = null
      this.triggerAllValidations()
      this.isOpenCreatedPODialog = false
      this.scrollToTop()
    },

    activeViewOnlyMode () {
      this.readonlyMode = true
      this.isOpenCreatedPODialog = false
      this.scrollToTop()
    },

    async handleProceedToPayButtonClicked () {
      this.isSubmittingData = true
      await this.$nextTick()
      this.goToPayPOPage()
    },

    scrollToTop () {
      window.scrollTo(0, 0)
    }
  }
}

</script>

<style lang="scss" scoped>
  .b-row-remove-icon {
    color: unset;
  }
  .total-area {
  padding-left: 24px; padding-right: 0px;}
  @media (max-width: 991px) {
    .total-area {
      padding-left: 16px; } }
  .btn-size {
    min-width: 210px;
    max-height: 55px
  }

  @media (max-width: 991px) and (min-width: 768px) {
    .submit-button {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
</style>
