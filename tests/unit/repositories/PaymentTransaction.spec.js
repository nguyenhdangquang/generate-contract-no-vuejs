import sinon from 'sinon'
import * as HttpCommon from '@/repositories/HttpCommon'
import * as PaymentTransactions from '@/repositories/PaymentTransactions'
import { assert } from 'chai'

describe('repositories/PaymentTransaction', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  describe('create', function () {
    const mockedPayload = {
      payCountry: 'SG',
      poList: ['SG2103174164']
    }

    it('should send post request to correct url', async function () {
      const mockedPost = sinon.stub(HttpCommon.Http, 'post').resolves({ data: null })

      await PaymentTransactions.create(mockedPayload)

      assert.isTrue(mockedPost.calledOnce)
      assert.deepEqual(mockedPost.args[0][0], '/v1/paymentTransactions')
      assert.deepEqual(mockedPost.args[0][1], mockedPayload)
    })

    it('should send data from response back', async () => {
      const mockedData = {
        txnRef: 'SGHSBC605621171617341585',
        currency: 'SGD',
        amount: 1050,
        country: 'SG',
        qrCode: '00020101021226320012hk.com.hkicl0207600050906011520400005303344540510.505802HK5902NA6002HK62270523HKTEST202103190606259626304BCD1'
      }
      sinon.stub(HttpCommon.Http, 'post')
        .resolves({ data: mockedData })

      const data = await PaymentTransactions.create(mockedPayload)

      assert.deepEqual(data, mockedData)
    })

    it('should send error from response back', async function () {
      const errorData = { message: 'PO number is either alphabet or numeric. Please try again.' }
      sinon.stub(HttpCommon.Http, 'post').rejects({
        response: errorData
      })

      await PaymentTransactions.create(mockedPayload)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, errorData)
        })
    })

    it('should throw any unexpected errors', async () => {
      sinon.stub(HttpCommon.Http, 'post').rejects({
        message: 'Bad error structure'
      })

      await PaymentTransactions.create(mockedPayload)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, {
            message: 'Bad error structure'
          })
        })
    })
  })

  describe('retry', function () {
    const transactionUid = 'SG98219237'
    it('should send post request to correct url', async function () {
      const mockedPost = sinon.stub(HttpCommon.Http, 'post').resolves({ data: null })
      await PaymentTransactions.retry(transactionUid)
      assert.isTrue(mockedPost.calledOnce)
      assert.deepEqual(mockedPost.args[0][0], '/v1/paymentTransactions/retry')
      assert.deepEqual(mockedPost.args[0][1], { transactionUid })
    })
    it('should receive data from response back', async () => {
      const mockedData = {
        txnRef: 'SGHSBC605621171617341585',
        currency: 'SGD',
        amount: 1050,
        country: 'SG',
        qrCode: '00020101021226320012hk.com.hkicl0207600050906011520400005303344540510.505802HK5902NA6002HK62270523HKTEST202103190606259626304BCD1'
      }
      sinon.stub(HttpCommon.Http, 'post')
        .resolves({ data: mockedData })
      const data = await PaymentTransactions.retry(transactionUid)
      assert.deepEqual(data, mockedData)
    })
    it('should send error from response back', async function () {
      const errorData = { message: 'PO number is either alphabet or numeric. Please try again.' }
      sinon.stub(HttpCommon.Http, 'post').rejects({
        response: errorData
      })
      await PaymentTransactions.create(transactionUid)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, errorData)
        })
    })
    it('should throw any unexpected errors', async () => {
      sinon.stub(HttpCommon.Http, 'post').rejects({
        message: 'Bad error structure'
      })
      await PaymentTransactions.retry(transactionUid)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, {
            message: 'Bad error structure'
          })
        })
    })

    it('should throw any unexpected errors - response', async () => {
      sinon.stub(HttpCommon.Http, 'post').rejects({
        response: 'Bad error structure'
      })
      await PaymentTransactions.retry(transactionUid)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, 'Bad error structure')
        })
    })
  })

  describe('updateTransactionStatus', function () {
    const transactionUid = 'SG98219237'
    const transactionStatus = true
    it('should send post request to correct url', async function () {
      const mockedPost = sinon.stub(HttpCommon.Http, 'post').resolves({ data: null })
      await PaymentTransactions.updateTransactionStatus(transactionUid, transactionStatus)
      assert.isTrue(mockedPost.calledOnce)
      assert.deepEqual(mockedPost.args[0][0], '/v1/paymentTransactions/SG98219237/updateTransactionStatus')
      assert.deepEqual(mockedPost.args[0][1], { transactionStatus })
    })
    it('should receive data from response back', async () => {
      const mockedData = {
        txnRef: 'SGHSBC605621171617341585',
        currency: 'SGD',
        amount: 1050,
        country: 'SG',
        qrCode: '00020101021226320012hk.com.hkicl0207600050906011520400005303344540510.505802HK5902NA6002HK62270523HKTEST202103190606259626304BCD1'
      }
      sinon.stub(HttpCommon.Http, 'post')
        .resolves({ data: mockedData })
      const data = await PaymentTransactions.updateTransactionStatus(transactionUid, transactionStatus)
      assert.deepEqual(data, mockedData)
    })
    it('should send error from response back', async function () {
      const errorData = { message: 'PO number is either alphabet or numeric. Please try again.' }
      sinon.stub(HttpCommon.Http, 'post').rejects({
        response: errorData
      })
      await PaymentTransactions.updateTransactionStatus(transactionUid, transactionStatus)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, errorData)
        })
    })
    it('should throw any unexpected errors', async () => {
      sinon.stub(HttpCommon.Http, 'post').rejects({
        message: 'Bad error structure'
      })
      await PaymentTransactions.updateTransactionStatus(transactionUid, transactionStatus)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, {
            message: 'Bad error structure'
          })
        })
    })

    it('should throw any unexpected errors - response', async () => {
      sinon.stub(HttpCommon.Http, 'post').rejects({
        response: 'Bad error structure'
      })
      await PaymentTransactions.updateTransactionStatus(transactionUid, transactionStatus)
        .then(() => { assert.fail('should throw') })
        .catch(err => {
          assert.deepEqual(err, 'Bad error structure')
        })
    })
  })
})
