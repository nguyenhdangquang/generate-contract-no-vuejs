import sinon from 'sinon'
import * as HttpCommon from '@/repositories/HttpCommon'
import * as PurchaseOrders from '@/repositories/PurchaseOrders'
import { assert } from 'chai'

describe('repositories/PurchaseOrders', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  describe('create', () => {
    const mockedPayload = {
      companyName: 'Company A',
      emailAddress: 'test@gmail.com',
      contactNumber: '12345678',
      blInvList: [{ number: '123456' }, { number: 'abcdef' }],
      areaCode: '+65',
      countryCode: 'SG'
    }

    it('should send post request to correct url', async () => {
      const mockedPost = sinon.stub(HttpCommon.Http, 'post').resolves({ data: null })

      await PurchaseOrders.create(mockedPayload)

      assert.isTrue(mockedPost.calledOnce)
      assert.deepEqual(mockedPost.args[0][0], '/v1/purchaseOrders')
      assert.deepEqual(mockedPost.args[0][1], mockedPayload)
    })

    it('should send data from response back', async () => {
      const mockedData = { id: '123123' }
      sinon.stub(HttpCommon.Http, 'post')
        .resolves({ data: mockedData })

      const data = await PurchaseOrders.create(mockedPayload)

      assert.deepEqual(data, mockedData)
    })

    it('should send error from response back', async () => {
      const errorData = { message: 'Invalid company name' }
      sinon.stub(HttpCommon.Http, 'post').rejects({
        response: {
          data: errorData
        }
      })

      await PurchaseOrders.create(mockedPayload)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, errorData)
        })
    })

    it('should throw any unexpected errors', async () => {
      sinon.stub(HttpCommon.Http, 'post').rejects({
        message: 'Bad error structure'
      })

      await PurchaseOrders.create(mockedPayload)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, {
            message: 'Bad error structure'
          })
        })
    })
  })

  describe('getOne', () => {
    it('should send get request to correct url', async () => {
      const poUid = '123123'
      const mockRequestParams = {
        countryCode: 'SG'
      }
      const mockedGet = sinon.stub(HttpCommon.Http, 'get').resolves({ data: null })

      await PurchaseOrders.getOne(poUid, mockRequestParams)

      assert.isTrue(mockedGet.calledOnce)
    })

    it('should send data from response back', async () => {
      const poUid = '123123'
      const mockRequestParams = {
        countryCode: 'SG'
      }
      const mockData = {
        poUid: 'test123123',
        countryCode: 'SG',
        areaCode: '+65'
      }
      sinon.stub(HttpCommon.Http, 'get').resolves({
        data: mockData
      })

      const data = await PurchaseOrders.getOne(poUid, mockRequestParams)
      assert.deepEqual(data, mockData)
    })

    it('should send error from response back', async () => {
      const poUid = '123123'
      const mockRequestParams = {
        countryCode: 'SG'
      }
      const errorData = { message: 'Invalid data' }
      sinon.stub(HttpCommon.Http, 'get').rejects({
        response: {
          data: errorData
        }
      })

      await PurchaseOrders.getOne(poUid, mockRequestParams)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, errorData)
        })
    })

    it('should throw any unexpected errors', async () => {
      sinon.stub(HttpCommon.Http, 'get').rejects({
        message: 'Bad error structure'
      })
      const poUid = '123123'
      const mockRequestParams = {
        countryCode: 'SG'
      }

      await PurchaseOrders.getOne(poUid, mockRequestParams)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, {
            message: 'Bad error structure'
          })
        })
    })
  })
})
