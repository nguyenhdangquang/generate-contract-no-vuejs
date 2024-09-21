export class TransactionStatusListener {
  /**
   * @type {WebSocket}
   */
  static ws;

  static startListener () {
    const ws = new window.WebSocket(process.env.VUE_APP_SOCKET_URL)
    TransactionStatusListener.ws = ws
  }

  static addLifeCycleListeners ({
    onOpen,
    onClose,
    onError,
    onMessage
  }) {
    if (!TransactionStatusListener.ws) {
      return
    }

    TransactionStatusListener.ws.addEventListener('open', onOpen)
    TransactionStatusListener.ws.addEventListener('close', onClose)
    TransactionStatusListener.ws.addEventListener('error', onError)
    TransactionStatusListener.ws.addEventListener('message', onMessage)
  }

  static removeLifeCycleListeners ({
    onOpen,
    onClose,
    onError,
    onMessage
  }) {
    if (!TransactionStatusListener.ws) {
      return
    }

    TransactionStatusListener.ws.removeEventListener('open', onOpen)
    TransactionStatusListener.ws.removeEventListener('close', onClose)
    TransactionStatusListener.ws.removeEventListener('error', onError)
    TransactionStatusListener.ws.removeEventListener('message', onMessage)
  }

  static close () {
    if (!TransactionStatusListener.ws) {
      return
    }

    TransactionStatusListener.ws.close()
    TransactionStatusListener.ws = null
  }
}
