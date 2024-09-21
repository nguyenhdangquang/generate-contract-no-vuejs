import { assert } from 'chai'
import sinon from 'sinon'
import PaymentGatewayPage from '@/views/payment-gateway/Index.vue'
import { TransactionStatusListener } from '@/views/payment-gateway/services/transaction-status-listener'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import CancelDialog from '@/components/dialog/CancelDialog.vue'

const localVue = createAppLocalVue()
describe('payment-gateway: cancel-button.spec', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should render cancel dialog when click cancel button', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const propsData = {
      createdPaymentTransaction: {
        transactionUid: 'SG12312234234234',
        currency: 'SGD',
        totalLocalAmount: 123.45,
        qrCode: '123424324'
      },
      country: {
        defaultCurrency: {
          thousandSeparator: ',',
          decimalPlaces: 2
        }
      }
    }
    const wrapper = await shallowMountPage(PaymentGatewayPage, { localVue, propsData })
    const canncelButton = wrapper.find('[data-testid="cancelButton"]')
    const cancelDialog = wrapper.findComponent(CancelDialog)
    await canncelButton.trigger('click')
    assert.isTrue(cancelDialog.props('isOpen'))
  })

  it('should hide cancel dialog when click discard button', async () => {
    sinon.stub(TransactionStatusListener, 'startListener')
    sinon.stub(TransactionStatusListener, 'addLifeCycleListeners')
    const propsData = {
      createdPaymentTransaction: {
        transactionUid: 'SG12312234234234',
        currency: 'SGD',
        totalLocalAmount: 123.45,
        qrCode: '123424324'
      },
      country: {
        defaultCurrency: {
          thousandSeparator: ',',
          decimalPlaces: 2
        }
      }
    }
    const wrapper = await shallowMountPage(PaymentGatewayPage, { localVue, propsData })
    const canncelButton = wrapper.find('[data-testid="cancelButton"]')
    const cancelDialog = wrapper.findComponent(CancelDialog)
    await canncelButton.trigger('click')
    await wrapper.vm.$nextTick()
    await cancelDialog.vm.$emit('discard')
    await wrapper.vm.$nextTick()
    assert.isFalse(cancelDialog.props('isOpen'))
  })
})
