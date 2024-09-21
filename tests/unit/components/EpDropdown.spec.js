import sinon from 'sinon'
import { shallowMount } from '@vue/test-utils'
import EPDropdown from '@/components/EpDropdown.vue'
import { createAppLocalVue } from '../utils'
import { assert } from 'chai'

describe('<EpDropdown />', () => {
  const localVue = createAppLocalVue()

  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render successfully', () => {
    const wrapper = shallowMount(EPDropdown, {
      localVue
    })

    assert.isTrue(wrapper.exists())
  })

  it('should render selectedItem slot', () => {
    const mockSelectedItem = { value: 'value 1' }
    const wrapper = shallowMount(EPDropdown, {
      localVue,
      propsData: {
        items: [{ value: 'value 1' }, { value: 'value 2' }, { value: 'value 3' }],
        selectedItem: mockSelectedItem
      },
      scopedSlots: {
        selectedItem ({ selectedItem }) {
          return <button id="selectedItem">{selectedItem.value}</button>
        }
      }
    })

    assert.isTrue(wrapper.find('button#selectedItem').exists())
    assert.equal(wrapper.find('button#selectedItem').text(), mockSelectedItem.value)
  })

  it('should not open dropdown initially', async () => {
    const wrapper = shallowMount(EPDropdown, {
      localVue,
      propsData: {
        items: [{ value: 'value 1' }, { value: 'value 2' }, { value: 'value 3' }]
      },
      scopedSlots: {
        items: ({ item }) => <div>{item.value}</div>
      }
    })

    assert.isFalse(wrapper.find('[data-testid="dropdown"]').exists())
  })

  it('should open dropdown when clicking trigger', async () => {
    const mockItems = [{ value: 'value 1' }, { value: 'value 2' }, { value: 'value 3' }]
    const wrapper = shallowMount(EPDropdown, {
      localVue,
      propsData: {
        items: mockItems
      },
      scopedSlots: {
        item: ({ item }) => item.value
      }
    })

    const trigger = wrapper.findComponent({ ref: 'trigger' })
    trigger.trigger('click')
    await wrapper.vm.$nextTick()

    const dropdown = wrapper.findComponent({ ref: 'dropdown' })
    assert.isTrue(dropdown.exists())

    const listItems = wrapper.findAll('li')

    for (let i = 0; i < listItems.length; i += 1) {
      assert.equal(listItems.at(i).text(), mockItems[i].value)
    }
  })

  it('should not open disabled dropdown when clicking trigger', async () => {
    const mockItems = [{ value: 'value 1' }, { value: 'value 2' }, { value: 'value 3' }]
    const wrapper = shallowMount(EPDropdown, {
      localVue,
      propsData: {
        items: mockItems,
        disabled: true
      },
      scopedSlots: {
        item: ({ item }) => item.value
      }
    })

    const trigger = wrapper.findComponent({ ref: 'trigger' })
    trigger.trigger('click')
    await wrapper.vm.$nextTick()

    const dropdown = wrapper.findComponent({ ref: 'dropdown' })
    assert.isFalse(dropdown.exists())
  })

  it('should close dropdown when clicking trigger again', async () => {
    const mockItems = [{ value: 'value 1' }, { value: 'value 2' }, { value: 'value 3' }]
    const wrapper = shallowMount(EPDropdown, {
      localVue,
      propsData: {
        items: mockItems
      },
      scopedSlots: {
        item: ({ item }) => item.value
      }
    })

    const trigger = wrapper.findComponent({ ref: 'trigger' })
    trigger.trigger('click')
    await wrapper.vm.$nextTick()

    assert.isTrue(wrapper.findComponent({ ref: 'dropdown' }).isVisible())

    trigger.trigger('click')
    await wrapper.vm.$nextTick()

    assert.isFalse(wrapper.findComponent({ ref: 'dropdown' }).exists())
  })

  it('should emit event when clicking item', async () => {
    const mockItems = [{ value: 'value 1' }, { value: 'value 2' }, { value: 'value 3' }]
    const wrapper = shallowMount(EPDropdown, {
      localVue,
      propsData: {
        items: mockItems
      },
      scopedSlots: {
        item: ({ item }) => item.value
      }
    })

    const trigger = wrapper.findComponent({ ref: 'trigger' })
    trigger.trigger('click')
    await wrapper.vm.$nextTick()

    const listItems = wrapper.findAll('li')
    const firstItem = listItems.at(0)
    firstItem.trigger('click')

    assert.equal(wrapper.emitted('update:selectedItem').length, 1)
    assert.equal(wrapper.emitted('update:selectedItem')[0][0].value, mockItems[0].value)
  })

  it('should close when clicking outside', async () => {
    const map = {}
    sinon.stub(window, 'addEventListener').callsFake((event, callback) => {
      map[event] = callback
    })
    sinon.stub(window, 'removeEventListener').callsFake((event, callback) => {
      if (map[event] === callback) {
        map[event] = null
      }
    })
    const mockItems = [{ value: 'value 1' }, { value: 'value 2' }, { value: 'value 3' }]
    const wrapper = shallowMount(EPDropdown, {
      localVue,
      propsData: {
        items: mockItems
      },
      scopedSlots: {
        item: ({ item }) => item.value
      }
    })

    const trigger = wrapper.findComponent({ ref: 'trigger' })
    trigger.trigger('click')
    await wrapper.vm.$nextTick()

    const dropdown = wrapper.findComponent({ ref: 'dropdown' })
    assert.isTrue(dropdown.exists())

    const div = document.createElement('div')
    document.body.prepend(div)
    map.mousedown({
      target: div
    })
    div.remove()
    await wrapper.vm.$nextTick()

    assert.isFalse(wrapper.findComponent({ ref: 'dropdown' }).exists())
  })
})
