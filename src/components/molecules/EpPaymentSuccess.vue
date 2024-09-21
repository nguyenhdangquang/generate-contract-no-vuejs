<template>
  <Modal :isOpen="isOpen" closeOnClickOutside>
    <div class="payment-success-wrapper">
      <img src="../../../static/img/payment-success.svg" width="72" height="72" alt="payment-success-icon">
      <p class="title">Your payment is successful!</p>
      <p class="payment-success-total-amount">{{ `${currency} ${formattedTotalAmount}` }}</p>
      <p class="payment-success-create-at">{{ getDateTimezone(payDate, countryCode) }}</p>
      <p class="payment-success-transaction-id">Transaction ID: {{ transactionUid }}</p>
      <div class="btn-wrapper">
        <EpButton class="btn new-payment mr-16" @click="handleNewPayment">New Payment</EpButton>
        <EpButton class="btn home-page ml-16" @click="handleHomePage">Home Page</EpButton>
      </div>
    </div>
  </Modal>
</template>
<script>
import Modal from '../Modal'
import EpButton from '../EpButton'
import { getDateTimezone } from '../../utils/getDateTimezone'

export default {
  components: {
    Modal,
    EpButton
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },

    payDate: {
      type: String,
      required: true
    },

    transactionUid: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      required: true
    },

    country: {
      type: Object,
      required: true
    }
  },

  computed: {
    formattedTotalAmount () {
      if (!this.country) {
        return '0'
      }

      return this.numberFormatter(
        this.country.defaultCurrency.thousandSeparator,
        this.country.defaultCurrency.decimalPlaces,
        this.amount
      )
    },

    countryCode () {
      if (!this.country) {
        return 'SG'
      }
      return this.country.code
    }
  },

  methods: {
    handleNewPayment () {
      this.$emit('newPayment')
    },

    handleHomePage () {
      this.$emit('homePage')
    },

    getDateTimezone
  }
}
</script>
<style lang="scss" scoped>
  p {
    margin-bottom: 0 !important;
  }
  .payment-success-wrapper {
    width: 100%;
    min-width: 426px;
    height: 100%;
    background: #FFFFFF;
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 2rem;
    justify-content: space-between;

    .title {
      font-weight: bold;
      font-size: 24px;
      line-height: 24px;
      text-align: center;
      text-transform: capitalize;
      color: #000000;
      margin-top: 16px;
    }

    .payment-success-total-amount{
      font-weight: bold;
      font-size: 24px;
      line-height: 24px;
      text-align: center;
      text-transform: capitalize;
      color: #BD0F72;
      margin-top: 24px;
    }

    .payment-success-create-at{
      font-weight: normal;
      font-size: 16px;
      line-height: 16px;
      text-align: center;
      color: #666666;
      margin-top: 8px;
    }

    .payment-success-transaction-id{
      font-weight: normal;
      font-size: 16px;
      line-height: 16px;
      text-align: center;
      text-transform: capitalize;
      color: #000000;
      margin-top: 24px;
    }

    .btn-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;

      .btn {
        min-height: 48px;
        width: 100% !important;
        background-color: #BD0F72;
        border-radius: 5px;
      }

      .new-payment:hover {
        background-color: #FFFFFF;
      }

      .home-page {
        background-color: #FFFFFF;
        border: 1px solid #004D6C;
        box-sizing: border-box;
        text-align: center;
        color: #004D6C;

        &:hover {
          background-color: #004D6C;
          color: #FFFFFF;
        }
      }
    }
  }

  .payment-success-totalAmount{
    font-weight: bold;
    font-size: 24px;
    line-height: 29px;
    text-align: center;
    text-transform: capitalize;
    color: #BD0F72;
  }
</style>
