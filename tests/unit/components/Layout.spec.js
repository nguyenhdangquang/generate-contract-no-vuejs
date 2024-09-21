import { shallowMount } from '@vue/test-utils'
import Layout from '@/components/Layout.vue'
import sinon from 'sinon'
import { assert } from 'chai'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { createAppLocalVue } from '../utils'
import { router } from '@/router'
import { createStore } from '../store-utils'
import DialogConfirmChangedCountry from '@/components/dialog/DialogConfirmChangedCountry.vue'

const localVue = createAppLocalVue()

describe('<Layout />', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
    router.push('/').catch(() => {})
  })

  it('should render Header and Footer', async () => {
    window.scrollTo = () => {}
    router.mode = 'abstract'
    const wrapper = shallowMount(Layout, {
      localVue,
      router: router,
      store: createStore()
    })

    const header = wrapper.findComponent(Header)
    assert.isTrue(header.exists())
    assert.deepEqual(header.props('currentFlag'), {
      urlImage: require('../../../static/img/flag-sg.svg'),
      countryCode: 'SG',
      countryValue: 'Singapore'
    })

    assert.isTrue(wrapper.findComponent(Footer).exists())
  })

  it('should render slot', () => {
    router.mode = 'abstract'
    const wrapper = shallowMount(Layout, {
      slots: {
        default: '<div data-testid="test-slot" />'
      },
      store: createStore(),
      localVue,
      router: router
    })

    assert.isTrue(wrapper.find('[data-testid="test-slot"]').exists())
  })

  it('should refresh when changing flag when have not change data', async () => {
    window.scrollTo = () => {}
    router.mode = 'abstract'
    const wrapper = shallowMount(Layout, {
      store: createStore(),
      router: router,
      localVue,
      propsData: { hasChangedData: false }
    })
    await wrapper.vm.$nextTick()

    const stubRouterGo = sinon.stub()
    wrapper.vm.$router.go = stubRouterGo

    wrapper.findComponent(Header).vm.$emit('flagChange', 'HK')
    await wrapper.vm.$nextTick()

    sinon.assert.called(stubRouterGo)
  })

  it('should refresh when changing flag when have changed data', async () => {
    window.scrollTo = () => {}
    router.mode = 'abstract'
    const wrapper = shallowMount(Layout, {
      store: createStore(),
      router: router,
      localVue,
      propsData: { hasChangedData: true }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const stubRouterGo = sinon.stub()
    wrapper.vm.$router.go = stubRouterGo

    const header = wrapper.findComponent(Header)
    header.vm.$emit('flagChange', 'HK')
    await header.vm.$nextTick()

    assert.equal(wrapper.emitted('update:openModalChangeCountry').length, 1)
    assert.isTrue(wrapper.emitted('update:openModalChangeCountry')[0][0])
  })

  it('should close confirm change country dialog when click discard', async () => {
    window.scrollTo = () => {}
    router.mode = 'abstract'
    const wrapper = shallowMount(Layout, {
      store: createStore(),
      router: router,
      localVue,
      propsData: { hasChangedData: true }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const header = wrapper.findComponent(Header)
    header.vm.$emit('flagChange', 'HK')
    await header.vm.$nextTick()

    const dialog = wrapper.findComponent(DialogConfirmChangedCountry)
    dialog.vm.$emit('discard')
    await dialog.vm.$nextTick()

    assert.equal(wrapper.emitted('update:openModalChangeCountry').length, 2)
    assert.isFalse(wrapper.emitted('update:openModalChangeCountry')[1][0])
  })

  it('should set current flag is default if not found country from flag list', async () => {
    window.scrollTo = () => {}
    router.mode = 'abstract'
    const wrapper = shallowMount(Layout, {
      store: createStore(),
      router: router,
      localVue,
      propsData: { hasChangedData: false },
      computed: {
        country: () => { return { code: 'LLLLLLL3' } }
      }
    })
    wrapper.vm.$options.watch.country.handler.call(wrapper.vm)

    assert.deepEqual(wrapper.vm.$data.currentFlag, wrapper.vm.$data.flagList[0])
  })

  it('should do not any action when choose flag what is choosing', async () => {
    window.scrollTo = () => {}
    router.mode = 'abstract'
    const wrapper = shallowMount(Layout, {
      store: createStore(),
      router: router,
      localVue,
      propsData: { hasChangedData: true }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const stubRouterGo = sinon.stub()
    wrapper.vm.$router.go = stubRouterGo

    const header = wrapper.findComponent(Header)
    header.vm.$emit('flagChange', 'SG')
    await header.vm.$nextTick()

    assert.isUndefined(wrapper.vm.$data.changingCountry)
  })
})
