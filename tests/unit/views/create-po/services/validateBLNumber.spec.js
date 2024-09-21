import { assert } from 'chai'
import { validateBLNumber } from '@/views/create-po/services/validateBLNumber'
import errors from '@/views/create-po/utils/errors'

describe('Validation BL/invoice number', () => {
  it('Success', async () => {
    const result = validateBLNumber('dsfsdfsdf')
    assert.equal(result, null)
  })

  it('Error - Required', async () => {
    const result = validateBLNumber('', errors)
    assert.equal(result, errors.BL_NUMBER_ERRORS.Required)
  })

  it('Error - Max length', async () => {
    const result = validateBLNumber('43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk434ddddddddddddddddkk', errors)
    assert.equal(result, errors.BL_NUMBER_ERRORS.MaxLength16)
  })

  it('Error - Bl include special character ] ', async () => {
    const result = validateBLNumber('dsfsdfsdf]', errors)
    assert.equal(result, errors.BL_NUMBER_ERRORS.MaxLength16)
  })
})
