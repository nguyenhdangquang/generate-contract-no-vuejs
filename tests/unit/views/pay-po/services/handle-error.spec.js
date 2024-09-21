import { assert } from 'chai'
import { getfield } from '@/views/pay-po/services/handle-error'

describe('services/handle-errors', () => {
  it('getfield - should return splitted value', () => {
    const field = 'poNumber/123456'
    const splitted = getfield(field)
    assert.equal(splitted, '123456')
  })
  it('getfield - should return null', () => {
    const field = 'poNumber'
    const splitted = getfield(field)
    assert.isNull(splitted)
  })
})
