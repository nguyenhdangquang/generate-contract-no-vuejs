import sinon from 'sinon'
import * as HttpCommon from '@/repositories/HttpCommon'
import * as Settings from '@/repositories/Settings'
import { assert } from 'chai'

describe('repositories/Settings', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  describe('findByCountryCode', () => {
    it('should send get request to correct url', async () => {
      const country = 'SG'
      const mockedGet = sinon.stub(HttpCommon.Http, 'get').resolves({ data: null })

      await Settings.findByCountryCode(country)

      assert.isTrue(mockedGet.calledOnce)
      assert.deepEqual(mockedGet.args[0][0], `/v1/settings/country/${country}`)
    })

    it('should send data from response back', async () => {
      const country = 'SG'
      const mockData = {
        country: 'SG',
        areaCode: '+65'
      }
      sinon.stub(HttpCommon.Http, 'get').resolves({ data: mockData })

      const responseData = await Settings.findByCountryCode(country)
      assert.deepEqual(responseData, mockData)
    })

    it('should send error from response back', async () => {
      const country = 'SG'
      const errorData = { message: 'Failed to find settings' }
      sinon.stub(HttpCommon.Http, 'get').rejects({
        response: {
          data: errorData
        }
      })

      await Settings.findByCountryCode(country)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, errorData)
        })
    })

    it('should throw any unexpected errors', async () => {
      const country = 'SG'
      sinon.stub(HttpCommon.Http, 'get').rejects({
        message: 'Bad error structure'
      })

      await Settings.findByCountryCode(country)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, {
            message: 'Bad error structure'
          })
        })
    })
  })
})
