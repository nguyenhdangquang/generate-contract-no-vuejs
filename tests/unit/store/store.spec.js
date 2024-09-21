import { assert } from 'chai'
import store from '@/store'

describe('store', () => {
  it('should register all modules', () => {
    assert.isTrue(store.hasModule('settings'))
    assert.isTrue(store.hasModule('purchaseOrder'))
  })
})
