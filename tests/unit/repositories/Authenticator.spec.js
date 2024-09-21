import sinon from 'sinon'
import * as HttpCommon from '@/repositories/HttpCommon'
import * as Authenticator from '@/repositories/Authenticator'
import { assert } from 'chai'
import StorageHelper from '@/utils/storageHelper'
describe('repositories/Authenticator', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })
  describe('generateAccessToken', () => {
    it('should send get request to correct url', async () => {
      const mockedGet = sinon.stub(HttpCommon.Http, 'post').resolves({ data: null })

      await Authenticator.generateAccessToken()

      assert.isTrue(mockedGet.calledOnce)
      assert.deepEqual(mockedGet.args[0][0], '/v1/authentication/generateAccessToken')
    })

    it('should send data from response back', async () => {
      const mockData = {
        accessToken: 'SG'
      }
      sinon.stub(HttpCommon.Http, 'post').resolves({ data: mockData })

      const responseData = await Authenticator.generateAccessToken()
      assert.deepEqual(responseData, mockData.accessToken)
    })

    it('should send error from response back', async () => {
      const errorData = { message: 'Failed to find Authenticator' }
      sinon.stub(HttpCommon.Http, 'post').rejects({
        response: {
          data: errorData
        }
      })

      await Authenticator.generateAccessToken()
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, errorData)
        })
    })

    it('should throw any unexpected errors', async () => {
      sinon.stub(HttpCommon.Http, 'post').rejects({
        message: 'Bad error structure'
      })

      await Authenticator.generateAccessToken()
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, {
            message: 'Bad error structure'
          })
        })
    })
  })
})
