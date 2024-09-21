import { assert } from 'chai'
import { validateContactNumber } from '@/views/create-po/services/validateContactNumber'
import { ErrorMessage } from '@/repositories/ErrorMessage'

describe('Validation contact number', () => {
  it('Success - 11 digits', async () => {
    const result = validateContactNumber('12345678901')
    assert.equal(result, '')
  })

  it('Success - 8 digits', async () => {
    const result = validateContactNumber('12345678')
    assert.equal(result, '')
  })

  it('Error - Required', async () => {
    const result = validateContactNumber('')
    assert.equal(result, ErrorMessage.CONTACT_REQUIRED)
  })

  it('Error - number only', async () => {
    const result = validateContactNumber('sdff123')
    assert.equal(result, ErrorMessage.CONTACT_NUMBER_ONLY)
  })

  it('Error - less than max length digits', async () => {
    const result = validateContactNumber('123')
    assert.equal(result, ErrorMessage.CONTACT_MAX_LENGTH)
  })

  it('Error - over max length digits', async () => {
    const result = validateContactNumber('2345678901112')
    assert.equal(result, ErrorMessage.CONTACT_MAX_LENGTH)
  })
})
