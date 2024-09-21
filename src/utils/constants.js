export const SINGAPORE_ISO_CODE = 'SG'
export const HONGKONG_ISO_CODE = 'HK'
export const INDONESIA_ISO_CODE = 'ID'
export const THAILAND_ISO_CODE = 'TH'
export const ISO_CODE_LIST = [SINGAPORE_ISO_CODE, HONGKONG_ISO_CODE, INDONESIA_ISO_CODE, THAILAND_ISO_CODE]
export const META_DESCRIPTION = {
  CREATE_PO: 'Create your Purchase Order for online payment of your shipment by using the B/L or Invoices numbers.',
  LANDING_PAGE: 'The global container shipping company ONE offers an online payment solution to pay easily and securely by using the B/L or Invoices numbers.',
  PAY_PO: 'Proceed to pay your Purchase Order using the e-Payment method at anytime and anywhere.',
  USER_GUIDE: 'Here is a User Guide to understand how to use the e-Payment Portal. If you can\'t find what you\'re looking for, please contact us to get help.',
  CONTACT_US: 'We would love to help you if you have any questions. Here is how you can reach us.',
  TERMS_OF_USE: 'These terms and conditions ("Agreement") set forth the general terms and conditions of your use of the ONE eCommerce Website.'
}
export const META_DESCRIPTION_DEFAULT_PROP = {
  vmid: 'description',
  name: 'description'
}

export const PAYMENT_GATEWAY_METHOD = {
  QR_CODE: 'qrCode',
  ONLINE_BANKING_PAYNOW: 'onlineBankingPayNow',
  PAGE_REDIRECT: 'pageRedirect'
}

export const COUNTRY_TIMEZONE = {
  SG: {
    timezone: 'Asia/Singapore',
    gmt: 8
  },
  HK: {
    timezone: 'HongKong',
    gmt: 8
  },
  ID: {
    timezone: 'Asia/Jakarta',
    gmt: 7
  }
}

export const LIST_TEXTS_BY_COUNTRY = {
  SG: {
    createPO: 'Create PO',
    payPO: 'Pay PO'
  },
  HK: {
    createPO: 'Create PO',
    payPO: 'Pay PO'
  },
  ID: {
    createPO: 'Payment registration',
    payPO: 'Payment proceed'
  },
  TH: {
    createPO: 'Payment registration',
    payPO: 'Payment proceed'
  }
}
export const MAX_RECORDS_BL = 450
