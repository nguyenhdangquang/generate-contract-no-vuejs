import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import EpAlert from '@/components/EpAlert.vue'

describe('<EpAlert />', () => {
  it('should render slot', () => {
    const wrapper = shallowMount(EpAlert, {
      slots: {
        default: 'Sample alert'
      }
    })

    assert.equal(wrapper.text(), 'Sample alert')
  })
})
