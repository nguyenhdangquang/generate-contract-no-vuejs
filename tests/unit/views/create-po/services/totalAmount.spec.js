import { assert } from 'chai'
// import sinon from 'sinon'
import { convertToNumber, calculateAmount } from '@/views/create-po/services/totalAmount'
// import { globalMixin } from '@/mixins/global-mixin'

describe('Total Amount Services', () => {
  it('Covert To Number', () => {
    const numberConvert = convertToNumber('25,68', '.')
    assert.equal(numberConvert, 25.68)
  })
  it('Calculated Amount', () => {
    const blList = [
      {
        no: 1,
        number: '',
        currency: 'SGD',
        amount: '23,12',
        remark: '',
        numberError: '',
        amountError: null,
        remarkError: null
      },
      {
        no: 2,
        number: '',
        currency: 'SGD',
        amount: '10,13',
        remark: '',
        numberError: '',
        amountError: '',
        remarkError: null
      },
      {
        no: 3,
        number: '',
        currency: 'SGD',
        amount: '5,01',
        remark: '',
        numberError: '',
        amountError: '',
        remarkError: null
      }
    ]
    const amount = calculateAmount(2, blList, '.')
    assert.equal(amount, 38.26)
  })
})
