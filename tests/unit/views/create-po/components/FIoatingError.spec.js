import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import FloatingError from '@/components/FloatingError.vue'

describe('FloatingError.vue', () => {
  it('shound render errors number title', async () => {
    const floatingErrors = [
      {
        no: 1,
        number: '',
        currency: 'SGD',
        amount: '',
        remark: '',
        numberError: 'It\'s required. Please input the B/L or Invoice number.',
        amountError: null,
        remarkError: null
      },
      {
        no: 2,
        number: '',
        currency: 'SGD',
        amount: '',
        remark: '',
        numberError: 'It\'s required. Please input the B/L or Invoice amount.',
        amountError: 'It\'s required. Please input the B/L or Invoice amount.',
        remarkError: null
      }
    ]
    const wrapper = shallowMount(FloatingError, {
      propsData: {
        floatingErrors
      }
    })
    assert.equal(wrapper.find('[data-testid="title-errors"]').text(), `You have ${floatingErrors.length} invalid record(s). Please edit to continue`)
  })
})
