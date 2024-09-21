import sinon from 'sinon'
import { assert } from 'chai'
import EpCountDown from '@/components/molecules/EpCountDown.vue'
import { shallowMount } from '@vue/test-utils'

describe('<EpCountDown.vue />', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers()
  })
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render displayTime', function () {
    const mockExpireTime = (new Date(new Date().getTime() + 0.1 * 60000)).toISOString()
    const wrapper = shallowMount(EpCountDown,
      {
        propsData: {
          expiry: mockExpireTime
        }
      })
    const label = wrapper.find('.time').text()
    assert.isString(label)
  })
  it('should render right time remainning', function () {
    const mockExpireTime = (new Date(new Date().getTime() + 0.1 * 60000)).toISOString()
    const wrapper = shallowMount(EpCountDown,
      {
        propsData: {
          expiry: mockExpireTime
        }
      })
    const time = wrapper.find('.time').text()
    assert.equal(time, '00:06')
  })

  it('display time should be an empty string when seconds remaining is null', async function () {
    const mockExpireTime = (new Date(new Date().getTime() + 0.1 * 60000)).toISOString()
    const wrapper = shallowMount(EpCountDown,
      {
        propsData: {
          expiry: mockExpireTime
        }
      })
    wrapper.setData({ secondsRemaining: null })
    await wrapper.vm.$nextTick()
    assert.equal(wrapper.find('.time').text(), '')
  })
  it('display time should be 00:00 when seconds remaining is less than 0', async function () {
    const mockExpireTime = (new Date(new Date().getTime() + 0.1 * 60000)).toISOString()
    const wrapper = shallowMount(EpCountDown,
      {
        propsData: {
          expiry: mockExpireTime
        }
      })
    await wrapper.setData({ secondsRemaining: -1 })
    await wrapper.vm.$nextTick()
    assert.equal(wrapper.find('.time').text(), '00:00')
  })

  it('Should clear interval when new expiry is null', async function () {
    const mockExpireTime = (new Date(new Date().getTime() + 0.1 * 60000)).toISOString()
    const wrapper = shallowMount(EpCountDown,
      {
        propsData: {
          expiry: mockExpireTime
        }
      })
    await wrapper.setProps({ expiry: null })
    await wrapper.vm.$nextTick()
  })

  it('Should emit timeout event when seconds remaining less than 0', async function () {
    const mockExpireTime = (new Date(new Date().getTime() + 0.1 * 60000)).toISOString()
    const wrapper = shallowMount(EpCountDown,
      {
        propsData: {
          expiry: mockExpireTime
        }
      })
    await wrapper.setData({ secondsRemaining: -1 })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ expiry: new Date(new Date().getTime() + (-0.1 * 60000)) })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    assert.equal(wrapper.emitted().timeout.length, 1)
  })
})
