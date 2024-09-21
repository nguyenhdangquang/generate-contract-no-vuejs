import * as handleError from '@/views/create-po/services/create-po/handle-error'
import { assert } from 'chai'

describe('create-po/services/create-po/handle-error', () => {
  describe('extractField', () => {
    it('should extract field and number', () => {
      assert.deepEqual(handleError.extractField('blInv/12312321/number'), {
        type: 'BL_ERROR',
        field: 'number',
        number: '12312321'
      })
    })

    it('should extract index', () => {
      assert.deepEqual(handleError.extractField('blInv/12'), {
        type: 'BL_ERROR',
        index: 12
      })
    })

    it('should return null if string is invalid', () => {
      assert.deepEqual(handleError.extractField('blInv//123123213'), null)
    })

    it('should return null if string is invalid', () => {
      assert.deepEqual(handleError.extractField('blInv/!@3dasf4'), null)
    })

    it('should return null if string is empty', () => {
      assert.deepEqual(handleError.extractField(''), null)
    })

    it('should return null if string is invalid', () => {
      assert.deepEqual(handleError.extractField('blInv/12/12313213'), null)
    })

    it('should return field object if string is not null and not startWidth blInv', () => {
      assert.deepEqual(handleError.extractField('test/12/12313213'), { field: 'test/12/12313213' })
    })
  })
})
