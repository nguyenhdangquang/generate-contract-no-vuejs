import { mapActions } from 'vuex'
import { PAYMENT_GATEWAY_METHOD } from '@/utils/constants'

export const paymentGatewaySG = {
  data () {
    return {
      isShowBankingOnlineNote: true
    }
  },

  methods: {
    ...mapActions({
      setPaymentGatewayMethod: 'application/setPaymentGatewayMethod'
    }),

    handleClickhereBankingOnlinePayNow () {
      this.setPaymentGatewayMethod(PAYMENT_GATEWAY_METHOD.ONLINE_BANKING_PAYNOW)
      this.closeListener()
    },

    hasCloseSocket () {
      /**
       * to do close websocket
       */
      console.log('socket at SG')
      this.closeListener()
    }
  }
}
