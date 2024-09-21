import { PAYMENT_GATEWAY_METHOD } from '@/utils/constants'

export const application = {
  namespaced: true,

  state: () => ({
    error: null,
    paymentGatewayMethod: PAYMENT_GATEWAY_METHOD.QR_CODE
  }),

  mutations: {
    setError (state, { title, message }) {
      state.error = {
        title,
        message
      }
    },

    clearError (state) {
      state.error = null
    },

    setPaymentGatewayMethod (state, paymentGatewayMethod) {
      state.paymentGatewayMethod = paymentGatewayMethod
    }
  },

  actions: {
    setError (context, { title, message }) {
      context.commit('setError', { title, message })
    },

    clearError (context) {
      context.commit('clearError')
    },

    setPaymentGatewayMethod (context, paymentGatewayMethod) {
      context.commit('setPaymentGatewayMethod', paymentGatewayMethod)
    }
  },

  getters: {
    error (state) {
      return state.error
    },

    getPaymentGatewayMethod (state) {
      return state.paymentGatewayMethod
    }
  }
}
