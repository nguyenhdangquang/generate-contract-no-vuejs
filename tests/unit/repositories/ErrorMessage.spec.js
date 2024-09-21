import { ErrorMessage } from '@/repositories/ErrorMessage'
import { assert } from 'chai'
import sinon from 'sinon'

describe('ErrorMessage', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should contain DEFAULT key', () => {
    assert.containsAllKeys(ErrorMessage, ['DEFAULT'])
    assert.isString(ErrorMessage.DEFAULT)
  })

  it('should contain NO_HAVE_DATA key', () => {
    assert.containsAllKeys(ErrorMessage, ['NO_HAVE_DATA'])
    assert.isString(ErrorMessage.NO_HAVE_DATA)
  })

  it('should contain EMAIL_REQUIRED key', () => {
    assert.containsAllKeys(ErrorMessage, ['EMAIL_REQUIRED'])
    assert.isString(ErrorMessage.EMAIL_REQUIRED)
  })

  it('should contain EMAIL_MAX_LENGTH_200 key', () => {
    assert.containsAllKeys(ErrorMessage, ['EMAIL_MAX_LENGTH_200'])
    assert.isString(ErrorMessage.EMAIL_MAX_LENGTH_200)
  })

  it('should contain EMAIL_VALID key', () => {
    assert.containsAllKeys(ErrorMessage, ['EMAIL_VALID'])
    assert.isString(ErrorMessage.EMAIL_VALID)
  })

  it('should contain COMPANY_REQUIRED key', () => {
    assert.containsAllKeys(ErrorMessage, ['COMPANY_REQUIRED'])
    assert.isString(ErrorMessage.COMPANY_REQUIRED)
  })

  it('should contain COMPANY_MAX_LENGTH_200 key', () => {
    assert.containsAllKeys(ErrorMessage, ['COMPANY_MAX_LENGTH_200'])
    assert.isString(ErrorMessage.COMPANY_MAX_LENGTH_200)
  })

  it('should contain CONTACT_REQUIRED key', () => {
    assert.containsAllKeys(ErrorMessage, ['CONTACT_REQUIRED'])
    assert.isString(ErrorMessage.CONTACT_REQUIRED)
  })

  it('should contain CONTACT_NUMBER_ONLY key', () => {
    assert.containsAllKeys(ErrorMessage, ['CONTACT_NUMBER_ONLY'])
    assert.isString(ErrorMessage.CONTACT_NUMBER_ONLY)
  })

  it('should contain CONTACT_MAX_LENGTH key', () => {
    assert.containsAllKeys(ErrorMessage, ['CONTACT_MAX_LENGTH'])
    assert.isString(ErrorMessage.CONTACT_MAX_LENGTH)
  })

  it('should contain BL_NUMBER_NOT_EXISTS key', () => {
    assert.containsAllKeys(ErrorMessage, ['BL_NUMBER_NOT_EXISTS'])
    assert.isString(ErrorMessage.BL_NUMBER_NOT_EXISTS)
  })

  it('should contain BL_NUMBER_REQUIRED key', () => {
    assert.containsAllKeys(ErrorMessage, ['BL_NUMBER_REQUIRED'])
    assert.isString(ErrorMessage.BL_NUMBER_REQUIRED)
  })

  it('should contain BL_NUMBER_LENGTH_16 key', () => {
    assert.containsAllKeys(ErrorMessage, ['BL_NUMBER_LENGTH_16'])
    assert.isString(ErrorMessage.BL_NUMBER_LENGTH_16)
  })

  it('should contain BL_AMOUNT_REQUIRED key', () => {
    assert.containsAllKeys(ErrorMessage, ['BL_AMOUNT_REQUIRED'])
    assert.isString(ErrorMessage.BL_AMOUNT_REQUIRED)
  })

  it('should contain BL_AMOUNT_GREATER_THAN_0 key', () => {
    assert.containsAllKeys(ErrorMessage, ['BL_AMOUNT_GREATER_THAN_0'])
    assert.isString(ErrorMessage.BL_AMOUNT_GREATER_THAN_0)
  })

  it('should contain BL_NUMBER_DUPLICATED key', () => {
    assert.containsAllKeys(ErrorMessage, ['BL_NUMBER_DUPLICATED'])
    assert.isString(ErrorMessage.BL_NUMBER_DUPLICATED)
  })

  it('should contain REMARK_MAX_LENGTH_2000 key', () => {
    assert.containsAllKeys(ErrorMessage, ['REMARK_MAX_LENGTH_2000'])
    assert.isString(ErrorMessage.REMARK_MAX_LENGTH_2000)
  })

  it('should contain EXCEL_MAX_SIZE_ERROR key', () => {
    assert.containsAllKeys(ErrorMessage, ['EXCEL_MAX_SIZE_ERROR'])
    assert.isString(ErrorMessage.EXCEL_MAX_SIZE_ERROR)
  })

  it('should contain EXCEL_FILE_DOES_NOT_SUPPORT key', () => {
    assert.containsAllKeys(ErrorMessage, ['EXCEL_FILE_DOES_NOT_SUPPORT'])
    assert.isString(ErrorMessage.EXCEL_FILE_DOES_NOT_SUPPORT)
  })

  it('should contain EMPTY_FILE_UPLOAD key', () => {
    assert.containsAllKeys(ErrorMessage, ['EMPTY_FILE_UPLOAD'])
    assert.isString(ErrorMessage.EMPTY_FILE_UPLOAD)
  })

  it('should contain CURRENCY_NOT_SUPPORTED key', () => {
    assert.containsAllKeys(ErrorMessage, ['CURRENCY_NOT_SUPPORTED'])
    assert.isString(ErrorMessage.CURRENCY_NOT_SUPPORTED)
  })

  it('should contain EXCEL_FILE_INCORRECT_FORMAT key', () => {
    assert.containsAllKeys(ErrorMessage, ['EXCEL_FILE_INCORRECT_FORMAT'])
    assert.isString(ErrorMessage.EXCEL_FILE_INCORRECT_FORMAT)
  })

  it('should contain PO_NUMBER_CONTAINS_SPECIAL_CHARACTER key', () => {
    assert.containsAllKeys(ErrorMessage, ['PO_NUMBER_CONTAINS_SPECIAL_CHARACTER'])
    assert.isString(ErrorMessage.PO_NUMBER_CONTAINS_SPECIAL_CHARACTER)
  })
})
