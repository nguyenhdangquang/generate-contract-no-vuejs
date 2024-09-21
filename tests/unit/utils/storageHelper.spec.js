import { assert } from 'chai'
import sinon from 'sinon'
import StorageHelper from '@/utils/storageHelper.js'

describe('StorageHelper', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('setItem', async () => {
    global.sessionStorage = {
      setItem: (key, value) => {
        return key + value
      }
    }
    const spy = sinon.spy(global.sessionStorage, 'setItem')
    StorageHelper.setItem('key', 'value')
    sinon.assert.calledOnce(spy)
    assert.deepEqual(spy.args, [['key', 'value']])
  })

  it('getItem', async () => {
    global.sessionStorage = {
      getItem: (key) => {
        return key
      }
    }
    const spy = sinon.spy(global.sessionStorage, 'getItem')
    StorageHelper.getItem('key')
    sinon.assert.calledOnce(spy)
    assert.deepEqual(spy.args, [['key']])
  })
})
