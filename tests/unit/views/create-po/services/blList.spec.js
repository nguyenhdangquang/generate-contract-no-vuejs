import { assert } from 'chai'
import { initRowData, initBL } from '@/views/create-po/services/blList'

describe('BL List Services', () => {
  it('init follow row data', async () => {
    const blList = initRowData(5, 'SGD')
    assert.equal(blList.length, 5)
  })
  it('init BL', async () => {
    const blList = initBL('SGD')
    assert.isObject(blList, true)
  })
})
