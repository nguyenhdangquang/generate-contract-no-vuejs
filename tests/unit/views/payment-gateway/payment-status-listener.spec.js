import sinon from 'sinon'
import PaymentGateway from '@/views/payment-gateway/Index.vue'
import { TransactionStatusListener } from '@/views/payment-gateway/services/transaction-status-listener'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createStore } from '../../store-utils'
import { assert } from 'chai'

const localVue = createAppLocalVue()

describe('<PayPO />: Payment status listener', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should listen to success and failure event', async () => {
    const stubbedStartListener = sinon.stub(TransactionStatusListener, 'startListener')
    const stubbedAddLifeCycleListeners = sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const store = createStore()
    await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: '123123123',
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })

    sinon.assert.calledOnce(stubbedStartListener)
    sinon.assert.calledOnce(stubbedAddLifeCycleListeners)
  })

  it('should remove listener and close connection on destroy', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const stubbedRemoveEventListener = sinon.stub(TransactionStatusListener, 'removeLifeCycleListeners')
    const stubbedClose = sinon.stub(TransactionStatusListener, 'close')
    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: '123123123',
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })

    wrapper.destroy()

    sinon.assert.calledOnce(stubbedRemoveEventListener)
    sinon.assert.calledOnce(stubbedClose)
  })

  it('should handle web socket open', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const stubConsole = sinon.stub(console, 'log')
    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: '123123123',
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })
    wrapper.vm.handleWebsocketOpen()

    sinon.assert.calledOnce(stubConsole)
    assert.deepEqual(stubConsole.args, [['[WEBSOCKET] [OPEN]: Connection established']])
  })

  it('should handle web socket error', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const stubConsole = sinon.stub(console, 'log')
    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: '123123123',
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })
    const error = {
      message: 'Something went wrong'
    }
    wrapper.vm.handleWebsocketError(error)

    sinon.assert.calledOnce(stubConsole)
    assert.deepEqual(stubConsole.args, [['[WEBSOCKET] [ERROR]: ' + error.message]])
  })

  it('should handle web socket close when was clean', async () => {
    sinon.stub(window, 'scrollTo')
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const stubConsole = sinon.stub(console, 'log')
    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: '123123123',
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })
    const event = {
      wasClean: true,
      code: 500,
      reason: 'Something went wrong'
    }
    wrapper.vm.handleWebsocketClose(event)

    sinon.assert.calledOnce(stubConsole)
    assert.deepEqual(stubConsole.args, [[`[WEBSOCKET] [CLOSE]: Connection closed cleanly, code=${event.code} reason=${event.reason}`]])
  })

  it('should handle web socket close when was not clean', async () => {
    sinon.stub(window, 'scrollTo')
    const stubStartListener = sinon.stub(TransactionStatusListener, 'startListener')
    const stubAddLifeCycleListener = sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const stubRemoveLifeCycleListener = sinon.stub(TransactionStatusListener, 'removeLifeCycleListeners')
    const stubCloseListener = sinon.stub(TransactionStatusListener, 'close')
    const stubConsole = sinon.stub(console, 'log')
    const store = createStore()
    const wrapper = await shallowMountPage(
      PaymentGateway,
      {
        localVue,
        store,
        propsData: {
          createdPaymentTransaction: {
            transactionUid: '123123123',
            currency: 'SGD',
            totalLocalAmount: 12000.22
          },
          country: {
            code: 'SG',
            defaultCurrency: {
              code: 'SGD',
              decimalPlaces: '2',
              thousandSeparator: ',',
              bankMaxAmount: 200000
            }
          }
        }
      })
    const event = {
      wasClean: false,
      code: 500,
      reason: 'Something went wrong'
    }
    wrapper.vm.handleWebsocketClose(event)

    sinon.assert.calledOnce(stubConsole)
    assert.deepEqual(stubConsole.args, [['[WEBSOCKET] [CLOSE]: Connection died, trying to reconnect']])
    sinon.assert.calledOnce(stubRemoveLifeCycleListener)
    sinon.assert.calledOnce(stubCloseListener)
    sinon.assert.calledTwice(stubStartListener)
    sinon.assert.calledTwice(stubAddLifeCycleListener)
  })
})
