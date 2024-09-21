import { assert } from 'chai'
import { validateCompanyName } from '@/views/create-po/services/validateCompanyName'
import { ErrorMessage } from '@/repositories/ErrorMessage'

describe('Validation company name', () => {
  it('Success', async () => {
    const result = validateCompanyName('dsfsdfsdf')
    assert.equal(result, '')
  })

  it('Error - Required', async () => {
    const result = validateCompanyName('')
    assert.equal(result, ErrorMessage.COMPANY_REQUIRED)
  })

  it('Error - Max length', async () => {
    const result = validateCompanyName('43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk434ddddddddddddddddkk')
    assert.equal(result, ErrorMessage.COMPANY_MAX_LENGTH_200)
  })
})
