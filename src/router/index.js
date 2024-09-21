import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import PageNotFound from '@/views/PageNotFound'
import CreatePO from '@/views/create-po/Index.vue'
import PayPO from '@/views/pay-po/Index.vue'
import UserGuide from '@/views/user-guide/Index.vue'
import TermsOfUse from '@/views/terms-of-use/Index.vue'
import ContactUs from '@/views/contact-us/Index.vue'
import Maintenance from '@/views/maintenance/Index.vue'

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/maintenance',
      name: 'Maintenance',
      component: Maintenance
    },
    {
      path: '/:countryCode?/create-po',
      name: 'CreatePO',
      component: CreatePO,
      meta: {
        title: 'Create PO | ONE - e-Payment'
      },
      props: true
    },
    {
      path: '/:countryCode?/pay-po',
      name: 'PayPO',
      component: PayPO,
      meta: {
        title: 'Pay PO | ONE - e-Payment'
      },
      props: true
    },
    {
      path: '/:countryCode?/contact-us',
      name: 'ContactUs',
      component: ContactUs,
      meta: {
        title: 'Contact Us | ONE - e-Payment'
      },
      props: true
    },
    {
      path: '/:countryCode?/terms-of-use',
      name: 'TermsOfUse',
      component: TermsOfUse,
      meta: {
        title: 'Terms of Use | ONE - e-Payment'
      },
      props: true
    },
    {
      path: '/:countryCode?/user-guide',
      name: 'UserGuide',
      component: UserGuide,
      meta: {
        title: 'User Guide | ONE - e-Payment'
      },
      props: true
    },
    {
      path: '/:countryCode?',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home | ONE - e-Payment'
      },
      props: true
    },
    {
      path: '*',
      name: 'NotFound',
      meta: {
        title: 'Not Found | ONE - e-Payment'
      },
      component: PageNotFound
    }
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
