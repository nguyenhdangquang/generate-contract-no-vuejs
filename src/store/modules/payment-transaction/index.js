export const paymentTransaction = {
  namespaced: true,

  state: () => ({
    createdPaymentTransaction: null
  }),

  mutations: {
    setCreatedPaymentTransaction (state, createdPaymentTransaction) {
      state.createdPaymentTransaction = createdPaymentTransaction
    }
  },

  actions: {
    setCreatedPaymentTransaction (context, createdPaymentTransaction) {
      context.commit('setCreatedPaymentTransaction', createdPaymentTransaction)
    }
  },

  getters: {
    createdPaymentTransaction (state) {
      return state.createdPaymentTransaction
    }
  }
}
