import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Loading from '@/components/Loading.vue'

describe('LoadingComponent.vue', () => {
  it('shound render default title', async () => {
    const wrapper = shallowMount(Loading, {
      propsData: {
        isRequesting: true
      }
    })
    await wrapper.vm.$nextTick()
    assert.equal(wrapper.find('[data-testid="title-loading"]').text(), 'Your data is being processed. Please wait...')
  })
  it('shound render loading', async () => {
    const wrapper = shallowMount(Loading, {
      propsData: {
        isRequesting: true
      }
    })
    await wrapper.vm.$nextTick()
    assert.isTrue(wrapper.find('#loading-modal').isVisible())
  })
  it('shound render title props', async () => {
    const wrapper = shallowMount(Loading, {
      propsData: {
        title: 'Another loading requesting'
      }
    })
    await wrapper.vm.$nextTick()
    assert.equal(wrapper.find('[data-testid="title-loading"]').text(), 'Another loading requesting')
  })
})
