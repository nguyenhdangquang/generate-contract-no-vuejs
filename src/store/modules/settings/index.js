import * as Settings from '@/repositories/Settings'

export const settings = {
  namespaced: true,

  state: () => ({
    settings: undefined
  }),

  mutations: {
    setSettings (state, _settings) {
      state.settings = _settings
    }
  },

  actions: {
    async getSettings ({ commit }, country) {
      const settingsData = await Settings.findByCountryCode(country ? country.toUpperCase() : undefined)
      commit('setSettings', settingsData)
    },
    async updateSettings ({ commit }, payload) {
      const { countryCode } = payload
      const settingsData = await Settings.findByCountryCode(countryCode)
      commit('setSettings', settingsData)
    }
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
    }
  }
}
