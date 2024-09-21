export const paymentGatewayHK = {
  data () {
    return {
      isShowBankingOnlineNote: false
    }
  },

  methods: {
    hasCloseSocket () {
      /**
       * to do close websocket
       */
      console.log('socket at HK')
      this.closeListener()
    }
  }
}
