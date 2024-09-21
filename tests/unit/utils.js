import Vuex from 'vuex'
import VueRouter from 'vue-router'
import PortalVue from 'portal-vue'
import { router } from '@/router'
import { globalMixin } from '@/mixins/global-mixin'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import fs from 'fs'
import Vue from 'vue'
import { dateTimeFilter } from '@/filters/date-time-filter'

Vue.config.ignoredElements = [
  'portal'
]

export function triggerInputChange (input, value) {
  input.element.value = value
  input.trigger('input')
  input.trigger('blur')
}

export function createAppLocalVue () {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  localVue.mixin(globalMixin)
  localVue.use(Vuex)
  localVue.filter('datetime', dateTimeFilter)
  localVue.use(PortalVue)

  return localVue
}

export function findByTestId (wrapper, testId) {
  return wrapper.find(`[data-testid=${testId}]`)
}

export function readFiles (filename, onFileContent, onError) {
  fs.readFile(filename, 'utf-8', function (err, content) {
    if (err) {
      onError(err)
      return
    }
    onFileContent(filename, content)
  })
}

export async function shallowMountPage (Page, { store, localVue, propsData, mocks, props, ...rest }) {
  router.mode = 'abstract'
  const wrapper = shallowMount(Page, {
    store,
    localVue,
    router: router,
    propsData,
    mocks,
    props,
    ...rest
  })
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()

  return wrapper
}

export async function mountPage (Page, { store, localVue }) {
  router.mode = 'abstract'
  const wrapper = mount(Page, { store, localVue, router: router })
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  return wrapper
}
