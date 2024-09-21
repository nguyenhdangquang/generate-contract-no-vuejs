export const purchaseOrder = {
  namespaced: true,

  state: () => ({
    createdPO: null
  }),

  mutations: {
    setCreatedPO (state, createdPO) {
      state.createdPO = createdPO
    }
  },

  actions: {
    setCreatedPO (context, createdPO) {
      context.commit('setCreatedPO', createdPO)
    }
  },

  getters: {
    createdPO (state) {
      return state.createdPO
    }
  }
}
