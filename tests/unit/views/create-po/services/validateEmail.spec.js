import { assert } from 'chai'
import { validateEmail } from '@/views/create-po/services/validateEmail'
import { ErrorMessage } from '@/repositories/ErrorMessage'

describe('Validation email', () => {
  it('Success', async () => {
    const result = validateEmail('abc@def.com')
    assert.equal(result, '')
  })

  it('Success - Email length 199', () => {
    const result = validateEmail(`${Array.from({ length: 199 - 6 }, () => 'b').join('')}@b.com`)
    assert.equal(result, '')
  })

  it('Success - Length 200', () => {
    const result = validateEmail(`${Array.from({ length: 200 - 6 }, () => 'b').join('')}@b.com`)
    assert.equal(result, '')
  })

  it('Error - Length 201', () => {
    const result = validateEmail(`${Array.from({ length: 201 - 6 }, () => 'b').join('')}@b.com`)
    assert.equal(result, ErrorMessage.EMAIL_MAX_LENGTH_200)
  })

  it('Error - Required', async () => {
    const result = validateEmail('')
    assert.equal(result, ErrorMessage.EMAIL_REQUIRED)
  })

  it('Error - Max length', async () => {
    const result = validateEmail('43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk43432423423hjkhjkhjk434ddddddddddddddddkk')
    assert.equal(result, ErrorMessage.EMAIL_MAX_LENGTH_200)
  })

  it('Error - Vietnamese in email', async () => {
    const result = validateEmail('tuilàtui@gmail.com')
    assert.equal(result, ErrorMessage.EMAIL_VALID)
  })

  it('Error - Special Character', async () => {
    const result = validateEmail('ab$c@def.com')
    assert.equal(result, ErrorMessage.EMAIL_VALID)
  })

  it('Error - without @', async () => {
    const result = validateEmail('abcdef.com')
    assert.equal(result, ErrorMessage.EMAIL_VALID)
  })

  it('Error - invalid', async () => {
    const result = validateEmail('abc@@def.com')
    assert.equal(result, ErrorMessage.EMAIL_VALID)
  })
})
