import Vuex from 'vuex'
import sinon from 'sinon'
import { PAYMENT_GATEWAY_METHOD } from '@/utils/constants'

export function createMockApplicationModule ({
  state = () => ({
    error: null,
    paymentGateway: PAYMENT_GATEWAY_METHOD.QR_CODE
  }),
  mutations = {},
  actions = {},
  getters = {}
} = {}) {
  return {
    namespaced: true,
    state,
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

      setPaymentGateway (state, paymentGateway) {
        state.paymentGateway = paymentGateway
      },

      ...mutations
    },
    actions: {
      setError (context, { title, message }) {
        context.commit('setError', { title, message })
      },

      clearError (context) {
        context.commit('clearError')
      },

      setPaymentGateway (context, paymentGateway) {
        context.commit('setPaymentGateway', paymentGateway)
      },

      ...actions
    },

    getters: {
      error (state) {
        return state.error
      },

      getPaymentGateway (state) {
        return state.paymentGateway
      },

      ...getters
    }
  }
}

export function createMockSettingsModule ({
  state = () => ({
    settings: null
  }),
  mutations = {},
  actions = {},
  getters = {}
} = {}) {
  return {
    namespaced: true,

    state,

    mutations: {
      setSettings (state, settings) {
        state.settings = settings
      },
      ...mutations
    },

    actions: {
      getSettings: sinon.stub().returns(Promise.resolve(true)),

      setSettings ({ commit }, settings) {
        commit('setSettings', settings)
      },

      ...actions
    },

    getters: {
      settings (state) {
        return state.settings
      },

      country (state) {
        if (!state.settings) {
          return null
        }

        return state.settings.country
      },

      ...getters
    }
  }
}

export function createMockPurchaseOrderModule ({
  state = () => ({
    createdPO: null
  }),
  mutations = {},
  actions = {},
  getters = {}
} = {}) {
  return {
    namespaced: true,

    state,

    mutations: {
      setCreatedPO (state, createdPO) {
        state.createdPO = createdPO
      },

      ...mutations
    },

    actions: {
      setCreatedPO (context, createdPO) {
        context.commit('setCreatedPO', createdPO)
      },

      ...actions
    },

    getters: {
      createdPO (state) {
        return state.createdPO
      },

      ...getters
    }
  }
}

export function createStore ({
  settingsModule = createMockSettingsModule(),
  purchaseOrderModule = createMockPurchaseOrderModule(),
  applicationModule = createMockApplicationModule()
} = {}) {
  const store = new Vuex.Store({
    modules: {
      settings: settingsModule,
      purchaseOrder: purchaseOrderModule,
      application: applicationModule
    }
  })

  return store
}
