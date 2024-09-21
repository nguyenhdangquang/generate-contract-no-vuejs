import Vuex from 'vuex'
import Vue from 'vue'
import * as purchaseOrderModule from './modules/purchase-order'
import * as settingsModule from './modules/settings'
import * as globalErrorModule from './modules/application'
import * as paymentTransactionModule from './modules/payment-transaction'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    purchaseOrder: purchaseOrderModule.purchaseOrder,
    settings: settingsModule.settings,
    application: globalErrorModule.application,
    paymentTransaction: paymentTransactionModule.paymentTransaction
  }
})
