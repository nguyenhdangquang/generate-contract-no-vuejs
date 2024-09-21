import { assert } from 'chai'
import { detectFloatingErrors } from '@/views/create-po/services/floatingErrors'

describe('Floating Services', () => {
  it('Detect Floating Errors', () => {
    const blList = [
      {
        no: 1,
        number: '',
        currency: 'SGD',
        amount: '',
        remark: '',
        numberError: '',
        amountError: null,
        remarkError: null
      },
      {
        no: 2,
        number: '',
        currency: 'SGD',
        amount: '',
        remark: '',
        numberError: 'It\'s required. Please input the B/L or Invoice amount.',
        amountError: 'It\'s required. Please input the B/L or Invoice amount.',
        remarkError: null
      },
      {
        no: 3,
        number: '',
        currency: 'SGD',
        amount: '',
        remark: '',
        numberError: 'It\'s required. Please input the B/L or Invoice amount.',
        amountError: 'It\'s required. Please input the B/L or Invoice amount.',
        remarkError: null
      }
    ]
    const errorsBL = detectFloatingErrors(blList)
    assert.equal(errorsBL.length, 2)
  })
})
