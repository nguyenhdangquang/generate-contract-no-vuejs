import sinon from 'sinon'
import BankingOnlineNote from '@/views/payment-gateway/components/BankingOnlineNote'
import { createAppLocalVue, shallowMountPage } from '../../../utils'
import { assert } from 'chai'
import { createMockApplicationModule, createStore } from '../../../store-utils'

const localVue = createAppLocalVue()

describe('<BankingOnlineNote />', () => {
  beforeEach(() => {
    sinon.stub(window, 'scrollTo')
  })
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should change payment gateway method to onlineBanking when click here is trigger', async () => {
    const mockedSetPaymentGatewayMethod = sinon.stub()
    const applicationModule = createMockApplicationModule({
      actions: {
        setPaymentGatewayMethod: mockedSetPaymentGatewayMethod
      }
    })
    const store = createStore({
      applicationModule
    })

    const propsData = {
      isShowing: true
    }
    const wrapper = await shallowMountPage(BankingOnlineNote, { store, localVue, propsData })
    const mockedClickHere = sinon.spy(wrapper.vm, '$emit')
    const clickhere = wrapper.find('[data-testid="click-here"]')
    clickhere.trigger('click')
    assert.equal(wrapper.emitted('clickHereBankingOnlinePayNow').length, 1)
    assert.isTrue(mockedClickHere.calledOnce)
  })
})
