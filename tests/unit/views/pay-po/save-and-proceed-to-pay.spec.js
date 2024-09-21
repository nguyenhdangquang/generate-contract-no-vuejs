import sinon from 'sinon'
import { assert } from 'chai'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockApplicationModule, createMockSettingsModule, createStore } from '../../store-utils'
import * as poNumberValidator from '@/views/pay-po/services/validatePoNumber'
import PayPOPage from '@/views/pay-po/Index.vue'
import EpPOPaymentRow from '@/components/molecules/EpPOPaymentRow'
import EpButton from '@/components/EpButton'
import EpPOProceedToPay from '@/components/molecules/EpPOProceedToPay'
import * as paymentTransactions from '@/repositories/PaymentTransactions'
import * as PurchaseOrder from '@/repositories/PurchaseOrders'
import { PO_NUMBER_ERRORS } from '@/views/pay-po/utils/errors'
import StorageHelper from '@/utils/storageHelper'

const localVue = createAppLocalVue()
const baseSettings = {
  country: {
    code: 'SG',
    defaultCurrency: {
      code: 'SGD',
      decimalPlaces: '2',
      thousandSeparator: ',',
      bankMaxAmount: 200000
    }
  }
}

const baseSettingsIndonesia = {
  country: {
    code: 'ID',
    defaultCurrency: {
      code: 'IDR',
      decimalPlaces: 0,
      thousandSeparator: '.',
      bankMaxAmount: 999999999999
    }
  }
}

describe('<PayPO />: Save and proceed to pay', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should open Modal Proceed To Pay', async () => {
    sinon.stub(PurchaseOrder, 'getOne').resolves()
    const mockValidatePoNumber = sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(null)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    const updatingRow = rows.at(1)
    const buttonProceed = wrapper.findComponent(EpButton)
    updatingRow.vm.$emit('update:poNumber', 'SG2001128398')
    await wrapper.vm.$nextTick()

    updatingRow.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    buttonProceed.vm.$emit('click')
    await wrapper.vm.$nextTick()

    assert.isTrue(wrapper.vm.$data.isOpenModalProceedToPay)
    assert.isTrue(mockValidatePoNumber.calledOnce)
  })

  it('should close Modal Proceed To Pay', async () => {
    sinon.stub(PurchaseOrder, 'getOne').resolves()
    const mockValidatePoNumber = sinon.stub(poNumberValidator, 'validatePoNumber')
      .returns(null)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    const updatingRow = rows.at(1)
    const buttonProceed = wrapper.findComponent(EpButton)
    updatingRow.vm.$emit('update:poNumber', 'SG2001128398')
    await wrapper.vm.$nextTick()

    updatingRow.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    buttonProceed.vm.$emit('click')
    await wrapper.vm.$nextTick()

    const epPOProceedToPay = wrapper.findComponent(EpPOProceedToPay)
    assert.isTrue(wrapper.vm.$data.isOpenModalProceedToPay)
    epPOProceedToPay.vm.$emit('discard')
    await wrapper.vm.$nextTick()
    assert.isFalse(wrapper.vm.$data.isOpenModalProceedToPay)
    assert.isTrue(mockValidatePoNumber.calledOnce)
  })

  it('should success when click confirm proceed to pay', async () => {
    sinon.stub(PurchaseOrder, 'getOne').resolves()
    const mockReponsePaymentTransactions = {
      payCountry: 'SG',
      payOffice: 'SINBB',
      poList: [],
      totalLocalAmount: 2,
      transactionUid: '3751617858156',
      payStatus: 'Y',
      payRefUid: 'TSG-1617858156000',
      payDate: '2021-04-08T05:02:36.000Z',
      transactionStatus: 'requestQRCode',
      createdAt: '2021-04-08T05:02:30.150Z',
      updatedAt: '2021-04-08T05:02:30.150Z'
    }
    const mockValidatePoNumber = sinon.stub(poNumberValidator, 'validatePoNumber').returns(null)
    const mockpaymentTransactions = sinon.stub(paymentTransactions, 'create').resolves(mockReponsePaymentTransactions)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    const updatingRow = rows.at(1)
    const buttonProceed = wrapper.findComponent(EpButton)
    updatingRow.vm.$emit('update:poNumber', 'SG2001128398')
    await wrapper.vm.$nextTick()

    updatingRow.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    buttonProceed.vm.$emit('click')
    await wrapper.vm.$nextTick()

    const epPOProceedToPay = wrapper.findComponent(EpPOProceedToPay)
    epPOProceedToPay.vm.$emit('confirm')
    await wrapper.vm.$nextTick()

    assert.isTrue(mockValidatePoNumber.calledOnce)
    assert.isTrue(mockpaymentTransactions.calledOnce)
    assert.isFalse(wrapper.vm.$data.isCreatingPayment)
    assert.deepEqual(wrapper.vm.$data.createdPaymentTransaction, mockReponsePaymentTransactions)
    assert.isFalse(wrapper.find('div[data-testid="pageRedirectForm"] #pay_form').exists())
  })

  it('should success when click confirm proceed to pay - then able to redirect to PaymentGateway of bank', async () => {
    sinon.stub(PurchaseOrder, 'getOne').resolves()
    const mockReponsePaymentTransactions = {
      payCountry: 'ID',
      payOffice: 'Demo',
      poList: [],
      totalLocalAmount: 2,
      transactionUid: '3751617858156',
      payStatus: 'Y',
      payRefUid: 'TSG-1617858156000',
      payDate: '2021-04-08T05:02:36.000Z',
      transactionStatus: 'requestQRCode',
      createdAt: '2021-04-08T05:02:30.150Z',
      updatedAt: '2021-04-08T05:02:30.150Z',
      redirectLink: `<script language="javascript">window.onload=function(){document.pay_form.submit();}</script>
      <form id="pay_form" name="pay_form" action="https://staging.doku.com/Suite/Receive" method="post">
      <input type="hidden" name="CURRENCY" id="CURRENCY" value="360">
      <input type="hidden" name="PAYMENTCHANNEL" id="PAYMENTCHANNEL" value="">
      <input type="hidden" name="SESSIONID" id="SESSIONID" value="5822">
      <input type="hidden" name="WORDS" id="WORDS" value="67d3e3a511f444ab8df5a04af4b1638d0f3360accccdf8c1379539b8f1a6dcec">
      <input type="hidden" name="CHAINMERCHANT" id="CHAINMERCHANT" value="NA">
      <input type="hidden" name="EMAIL" id="EMAIL" value="xuan.nguyentruong@one-line.com">
      <input type="hidden" name="PURCHASEAMOUNT" id="PURCHASEAMOUNT" value="12340.50">
      <input type="hidden" name="NAME" id="NAME" value="Tuanku Imam Bonjol">
      <input type="hidden" name="TRANSIDMERCHANT" id="TRANSIDMERCHANT" value="0002900F064577105XX1">
      <input type="hidden" name="REQUESTDATETIME" id="REQUESTDATETIME" value="20180611141025">
      <input type="hidden" name="PURCHASECURRENCY" id="PURCHASECURRENCY" value="360">
      <input type="hidden" name="MALLID" id="MALLID" value="5822">
      <input type="hidden" name="AMOUNT" id="AMOUNT" value="12340.50">
      <input type="hidden" name="BASKET" id="BASKET" value="Order Item 1,15000.00,2,30000.00;Order Item 2,24000.00,3,72000.00">
      </form>`
    }
    const mockValidatePoNumber = sinon.stub(poNumberValidator, 'validatePoNumber').returns(null)
    const mockpaymentTransactions = sinon.stub(paymentTransactions, 'create').resolves(mockReponsePaymentTransactions)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettingsIndonesia
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    const updatingRow = rows.at(1)
    const buttonProceed = wrapper.findComponent(EpButton)
    updatingRow.vm.$emit('update:poNumber', 'ID2001128398')
    await wrapper.vm.$nextTick()

    updatingRow.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    buttonProceed.vm.$emit('click')
    await wrapper.vm.$nextTick()

    const epPOProceedToPay = wrapper.findComponent(EpPOProceedToPay)
    epPOProceedToPay.vm.$emit('confirm')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    assert.isTrue(mockValidatePoNumber.calledOnce)
    assert.isTrue(mockpaymentTransactions.calledOnce)
    assert.isTrue(wrapper.vm.$data.isCreatingPayment)
    assert.deepEqual(wrapper.vm.$data.createdPaymentTransaction, mockReponsePaymentTransactions)
    assert.isTrue(wrapper.find('div[data-testid="pageRedirectForm"] #pay_form').exists())
  })

  it('should error when click confirm proceed to pay - with PONumberError', async () => {
    sinon.stub(PurchaseOrder, 'getOne').resolves()
    const mockReponsePaymentTransactions = {
      data: {
        errors: [
          {
            code: PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', 'SG').type,
            field: 'poNumber/SG2001128398',
            message: PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', 'SG').message
          }
        ]
      },
      status: 400
    }
    const mockValidatePoNumber = sinon.stub(poNumberValidator, 'validatePoNumber').returns(null)
    const mockpaymentTransactions = sinon.stub(paymentTransactions, 'create').rejects(mockReponsePaymentTransactions)
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const store = createStore({
      settingsModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    const updatingRow = rows.at(0)
    const buttonProceed = wrapper.findComponent(EpButton)
    const dataRow = {
      no: '1',
      poNumber: 'SG2001128398',
      records: 1,
      currency: baseSettings.country.defaultCurrency.code,
      amount: '100',
      companyName: 'Test',
      payStatus: 'N',
      error: null
    }
    wrapper.vm.$data.poPaymentList[0] = dataRow
    await wrapper.vm.$nextTick()

    updatingRow.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    buttonProceed.vm.$emit('click')
    await wrapper.vm.$nextTick()

    const epPOProceedToPay = wrapper.findComponent(EpPOProceedToPay)
    epPOProceedToPay.vm.$emit('confirm')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    assert.isTrue(mockValidatePoNumber.calledOnce)
    assert.isTrue(mockpaymentTransactions.calledOnce)
    assert.isFalse(wrapper.vm.$data.isCreatingPayment)
    assert.deepEqual(wrapper.vm.$data.poPaymentList[0].error, PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', 'SG'))
  })

  it('should error when click confirm proceed to pay - with SERVER ERROR', async () => {
    sinon.stub(PurchaseOrder, 'getOne').resolves()
    const mockReponsePaymentTransactions = {
      data: 'Some error occurred while retrieving paymentTransaction.',
      status: 500
    }
    const mockValidatePoNumber = sinon.stub(poNumberValidator, 'validatePoNumber').returns(null)
    const mockpaymentTransactions = sinon.stub(paymentTransactions, 'create').rejects(mockReponsePaymentTransactions)
    const applicationSetErrorStub = sinon.stub()
    const settingsModule = createMockSettingsModule({
      state: () => ({
        settings: baseSettings
      })
    })
    const applicationModule = createMockApplicationModule({
      actions: {
        setError: applicationSetErrorStub
      }
    })
    const store = createStore({
      settingsModule,
      applicationModule
    })
    const wrapper = await shallowMountPage(PayPOPage, { localVue, store })
    const rows = wrapper.findAllComponents(EpPOPaymentRow)
    const updatingRow = rows.at(0)
    const buttonProceed = wrapper.findComponent(EpButton)
    updatingRow.vm.$emit('update:poNumber', 'SG2001128398')
    await wrapper.vm.$nextTick()

    updatingRow.vm.$emit('blur')
    await wrapper.vm.$nextTick()

    buttonProceed.vm.$emit('click')
    await wrapper.vm.$nextTick()

    const epPOProceedToPay = wrapper.findComponent(EpPOProceedToPay)
    epPOProceedToPay.vm.$emit('confirm')
    await wrapper.vm.$nextTick()

    assert.isTrue(mockValidatePoNumber.calledOnce)
    assert.isTrue(mockpaymentTransactions.calledOnce)
    assert.isTrue(applicationSetErrorStub.calledOnce)
    assert.isFalse(wrapper.vm.$data.isCreatingPayment)
  })
})
