import { TransactionStatusListener } from '@/views/payment-gateway/services/transaction-status-listener'
import { assert } from 'chai'
import sinon from 'sinon'

describe('TransactionStatusListener', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should start listening to websocket', () => {
    const StubWebSocket = sinon.stub(window, 'WebSocket')

    TransactionStatusListener.startListener()

    sinon.assert.calledOnceWithExactly(StubWebSocket, process.env.VUE_APP_SOCKET_URL)
  })

  it('should add event listeners', () => {
    const stubbedAddEventListener = sinon.stub()
    TransactionStatusListener.ws = {
      addEventListener: stubbedAddEventListener
    }

    const stubOnOpen = sinon.stub()
    const stubOnClose = sinon.stub()
    const stubOnMessage = sinon.stub()
    const stubOnError = sinon.stub()
    TransactionStatusListener.addLifeCycleListeners({
      onOpen: stubOnOpen,
      onError: stubOnError,
      onClose: stubOnClose,
      onMessage: stubOnMessage
    })

    assert.isTrue(stubbedAddEventListener.called)
    assert.deepEqual(stubbedAddEventListener.args[0], ['open', stubOnOpen])
    assert.deepEqual(stubbedAddEventListener.args[1], ['close', stubOnClose])
    assert.deepEqual(stubbedAddEventListener.args[2], ['error', stubOnError])
    assert.deepEqual(stubbedAddEventListener.args[3], ['message', stubOnMessage])

    TransactionStatusListener.ws = null
  })

  it('should remove event listeners', () => {
    const stubbedRemoveEventListener = sinon.stub()
    TransactionStatusListener.ws = {
      removeEventListener: stubbedRemoveEventListener
    }

    const stubOnOpen = sinon.stub()
    const stubOnClose = sinon.stub()
    const stubOnMessage = sinon.stub()
    const stubOnError = sinon.stub()
    TransactionStatusListener.removeLifeCycleListeners({
      onOpen: stubOnOpen,
      onError: stubOnError,
      onClose: stubOnClose,
      onMessage: stubOnMessage
    })

    assert.isTrue(stubbedRemoveEventListener.called)
    assert.deepEqual(stubbedRemoveEventListener.args[0], ['open', stubOnOpen])
    assert.deepEqual(stubbedRemoveEventListener.args[1], ['close', stubOnClose])
    assert.deepEqual(stubbedRemoveEventListener.args[2], ['error', stubOnError])
    assert.deepEqual(stubbedRemoveEventListener.args[3], ['message', stubOnMessage])

    TransactionStatusListener.ws = null
  })

  it('addLifeCycleListeners - should do nothing when ws not found', () => {
    const stubbedAddEventListener = sinon.stub()
    TransactionStatusListener.ws = null

    const stubOnOpen = sinon.stub()
    const stubOnClose = sinon.stub()
    const stubOnMessage = sinon.stub()
    const stubOnError = sinon.stub()
    TransactionStatusListener.addLifeCycleListeners({
      onOpen: stubOnOpen,
      onError: stubOnError,
      onClose: stubOnClose,
      onMessage: stubOnMessage
    })

    assert.isTrue(stubbedAddEventListener.notCalled)
    assert.isNull(TransactionStatusListener.ws)
  })

  it('close connection - should do nothing when ws not found', () => {
    const stubbedClose = sinon.stub()
    TransactionStatusListener.ws = null

    TransactionStatusListener.close()

    assert.isTrue(stubbedClose.notCalled)
    assert.isNull(TransactionStatusListener.ws)
  })

  it('should close connection', () => {
    const stubbedClose = sinon.stub()
    TransactionStatusListener.ws = {
      close: stubbedClose
    }

    TransactionStatusListener.close()

    assert.isTrue(stubbedClose.calledOnce)

    assert.isNull(TransactionStatusListener.ws)
    TransactionStatusListener.ws = null
  })
})
