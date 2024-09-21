import { assert } from 'chai'
import sinon from 'sinon'
import { application } from '@/store/modules/application'
import { PAYMENT_GATEWAY_METHOD } from '@/utils/constants'

describe('store/application', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should be a namespaced module', () => {
    assert.isTrue(application.namespaced)
  })

  describe('state', () => {
    it('should create initial state', () => {
      assert.deepEqual(
        application.state(),
        {
          error: null,
          paymentGatewayMethod: PAYMENT_GATEWAY_METHOD.QR_CODE
        }
      )
    })
  })

  describe('mutations', () => {
    it('should set new error when calling setError', () => {
      const state = {
        error: null
      }

      const newError = {
        title: 'Test title',
        message: 'Something bad happened'
      }

      application.mutations.setError(state, newError)
      assert.deepEqual(state.error, newError)
    })

    it('should clear error when calling clearError', () => {
      const state = { error: { title: 'error', message: 'Sample error' } }
      application.mutations.clearError(state)
      assert.isNull(state.error)
    })

    it('should set payment gateway method when calling setPaymentGatewayMethod', () => {
      const state = {
        paymentGatewayMethod: PAYMENT_GATEWAY_METHOD.QR_CODE
      }

      const newPaymentGatewayMethod = PAYMENT_GATEWAY_METHOD.ONLINE_BANKING_PAYNOW

      application.mutations.setPaymentGatewayMethod(state, newPaymentGatewayMethod)
      assert.deepEqual(state.paymentGatewayMethod, newPaymentGatewayMethod)
    })
  })

  describe('actions', () => {
    it('should commit setError when calling setError action', () => {
      const mockedCommit = sinon.stub()
      const context = {
        commit: mockedCommit
      }
      const mockedError = { title: 'Test', message: 'Test error' }

      application.actions.setError(context, mockedError)
      assert.isTrue(mockedCommit.calledOnce)
      assert.deepEqual(mockedCommit.args[0], ['setError', mockedError])
    })

    it('should commit clearError when calling clearError action', () => {
      const mockedCommit = sinon.stub()
      const context = {
        commit: mockedCommit
      }

      application.actions.clearError(context)
      assert.isTrue(mockedCommit.calledOnce)
      assert.deepEqual(mockedCommit.args[0], ['clearError'])
    })

    it('should commit setPaymentGatewayMethod when calling setPaymentGatewayMethod action', () => {
      const mockedCommit = sinon.stub()
      const context = {
        commit: mockedCommit
      }

      const mockedPaymentGatewayMethod = PAYMENT_GATEWAY_METHOD.ONLINE_BANKING_PAYNOW

      application.actions.setPaymentGatewayMethod(context, PAYMENT_GATEWAY_METHOD.ONLINE_BANKING_PAYNOW)
      assert.isTrue(mockedCommit.calledOnce)
      assert.deepEqual(mockedCommit.args[0], ['setPaymentGatewayMethod', mockedPaymentGatewayMethod])
    })
  })

  describe('getters', () => {
    it('should return error when calling error getter', () => {
      const mockedError = { title: '12345', message: 'Test Error' }
      const mockedState = {
        error: mockedError
      }

      assert.deepEqual(application.getters.error(mockedState), mockedError)
    })

    it('should return paymentGatewayMethod when calling getPaymentGatewayMethod getter', () => {
      const mockedGetPaymentGatewayMethod = PAYMENT_GATEWAY_METHOD.QR_CODE
      const mockedState = {
        paymentGatewayMethod: mockedGetPaymentGatewayMethod
      }

      assert.deepEqual(application.getters.getPaymentGatewayMethod(mockedState), mockedGetPaymentGatewayMethod)
    })
  })
})
