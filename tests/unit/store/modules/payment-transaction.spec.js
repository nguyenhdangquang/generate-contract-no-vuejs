
import { assert } from 'chai'
import sinon from 'sinon'
import { paymentTransaction } from '@/store/modules/payment-transaction'

describe('store/paymentTransaction', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should be a namespaced module', () => {
    assert.isTrue(paymentTransaction.namespaced)
  })

  describe('state', () => {
    it('should create initial state', () => {
      assert.deepEqual(
        paymentTransaction.state(),
        {
          createdPaymentTransaction: null
        }
      )
    })
  })

  describe('mutations', () => {
    it('should set createdPaymentTransaction when calling createdPaymentTransaction', () => {
      const state = {
        createdPaymentTransaction: null
      }
      const newPaymentTransaction = {
        txnRef: 'SGHSBC605621171617341585',
        currency: 'SGD',
        amount: 1050,
        country: 'SG',
        qrCode: '00020101021226320012hk.com.hkicl0207600050906011520400005303344540510.505802HK5902NA6002HK62270523HKTEST202103190606259626304BCD1'
      }
      paymentTransaction.mutations.setCreatedPaymentTransaction(state, newPaymentTransaction)
      assert.deepEqual(state.createdPaymentTransaction, newPaymentTransaction)
    })
  })

  describe('actions', () => {
    it('should commit setCreatedPaymentTransaction when invoking setCreatedPaymentTransaction action', () => {
      const mockedCommit = sinon.stub()
      const context = {
        commit: mockedCommit
      }
      const mockCreatedPaymentTransaction = {
        txnRef: 'SGHSBC605621171617341585',
        currency: 'SGD',
        amount: 1050,
        country: 'SG',
        qrCode: '00020101021226320012hk.com.hkicl0207600050906011520400005303344540510.505802HK5902NA6002HK62270523HKTEST202103190606259626304BCD1'
      }
      paymentTransaction.actions.setCreatedPaymentTransaction(context, mockCreatedPaymentTransaction)
      assert.isTrue(mockedCommit.calledOnce)
      assert.deepEqual(mockedCommit.args[0], ['setCreatedPaymentTransaction', mockCreatedPaymentTransaction])
    })
  })
  describe('getters', () => {
    it('should return createdPaymentTransaction when calling getCreatedPaymentTransaction', () => {
      const mockCreatedPaymentTransaction = {
        txnRef: 'SGHSBC605621171617341585',
        currency: 'SGD',
        amount: 1050,
        country: 'SG',
        qrCode: '00020101021226320012hk.com.hkicl0207600050906011520400005303344540510.505802HK5902NA6002HK62270523HKTEST202103190606259626304BCD1'
      }
      const mockedState = {
        createdPaymentTransaction: mockCreatedPaymentTransaction
      }
      assert.deepEqual(paymentTransaction.getters.createdPaymentTransaction(mockedState), mockCreatedPaymentTransaction)
    })
  })
})
