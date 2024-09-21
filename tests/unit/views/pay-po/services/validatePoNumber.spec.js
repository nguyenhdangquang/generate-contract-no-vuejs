import { assert } from 'chai'
import sinon from 'sinon'
import { validatePoNumber, isValidPoFormat } from '@/views/pay-po/services/validatePoNumber'
import { PO_NUMBER_ERRORS } from '@/views/pay-po/utils/errors'

describe('validatePoNumber', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('Fail - should return required error', () => {
    assert.deepEqual(validatePoNumber(null, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_REQUIRED', 'SG'))
  })

  it('Fail - should return required error - with out poNumber', () => {
    assert.deepEqual(validatePoNumber({ poNumber: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_REQUIRED', 'SG'))
  })

  it('Fail - contains invalid characters', () => {
    assert.deepEqual(validatePoNumber({ poNumber: '#$asdf', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_CONTAINS_SPECIAL_CHARACTER', 'SG'))
  })

  it('Fail - does not contain 12 characters', () => {
    assert.deepEqual(validatePoNumber({ poNumber: '1234544', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_12_CHARACTERS', 'SG'))
  })

  it('Fail - has invalid structure', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'SG12345hnbji', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
  })

  it('Fail - Does not contain correct currency code', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'VN2011786545', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_WRONG_COUNTRY', 'SG'))
  })

  it('Fail - contains invalid year number', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'SG2211786545', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
  })

  it('Fail - contain invalid month number', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'SG2013786545', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
  })

  it('Fail - po already paid', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'SG2011786545', payStatus: 'Y' }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', 'SG'))
  })

  it('Success - returns null if no validation error', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'SG2011786545', payStatus: null }, 'SG'), null)
  })

  it('Fail - Year group contains character others than digits', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'SGYY11786545', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
  })

  it('Fail - Month group contains character others than digits', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'SG20MM786545', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
  })

  it('Fail - Does not end with 6 digits', () => {
    assert.deepEqual(validatePoNumber({ poNumber: 'SG2011MH5457', payStatus: null }, 'SG'), PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG'))
  })

  it('validate po number format - PO_NUMBER_REQUIRED - return false', () => {
    const type = PO_NUMBER_ERRORS('PO_NUMBER_REQUIRED', 'SG').type
    assert.equal(isValidPoFormat(type, 'SG'), false)
  })

  it('validate po number format - PO_NUMBER_12_CHARACTERS - return false', () => {
    const type = PO_NUMBER_ERRORS('PO_NUMBER_12_CHARACTERS', 'SG').type
    assert.equal(isValidPoFormat(type, 'SG'), false)
  })

  it('validate po number format - PO_NUMBER_INVALID_FORMAT - return false', () => {
    const type = PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', 'SG').type
    assert.equal(isValidPoFormat(type, 'SG'), false)
  })

  it('validate po number format - PO_NUMBER_WRONG_COUNTRY - return false', () => {
    const type = PO_NUMBER_ERRORS('PO_NUMBER_WRONG_COUNTRY', 'SG').type
    assert.equal(isValidPoFormat(type, 'SG'), false)
  })

  it('validate po number format - PO_NUMBER_CONTAINS_SPECIAL_CHARACTER - return false', () => {
    const type = PO_NUMBER_ERRORS('PO_NUMBER_CONTAINS_SPECIAL_CHARACTER', 'SG').type
    assert.equal(isValidPoFormat(type, 'SG'), false)
  })

  it('validate po number format - PO_NUMBER_ALREADY_PAID - return true', () => {
    const type = PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', 'SG').type
    assert.equal(isValidPoFormat(type, 'SG'), true)
  })

  it('validate po number format - PO_NUMBER_DOES_EXIST - return true', () => {
    const type = PO_NUMBER_ERRORS('PO_NUMBER_DOES_EXIST', 'SG').type
    assert.equal(isValidPoFormat(type, 'SG'), true)
  })

  it('validate po number format - PO_NUMBER_DUPLICATED - return true', () => {
    const type = PO_NUMBER_ERRORS('PO_NUMBER_DUPLICATED', 'SG').type
    assert.equal(isValidPoFormat(type, 'SG'), true)
  })
})
