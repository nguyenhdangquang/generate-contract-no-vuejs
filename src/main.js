import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store'
import UUID from 'vue-uuid'
import PortalVue from 'portal-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/css/bootstrap-grid.css'
import '../static/css/bootstrap-reboot.css'
import { globalMixin } from './mixins/global-mixin'
import { dateTimeFilter } from './filters/date-time-filter'
import Meta from 'vue-meta'

Vue.use(PortalVue)
Vue.use(UUID)
Vue.use(Meta)
Vue.config.productionTip = false
Vue.mixin(globalMixin)
Vue.filter('datetime', dateTimeFilter)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'ONE - e-Payment'
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
