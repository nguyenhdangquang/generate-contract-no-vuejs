<template>
  <div class="br-bt d-flex flex-column pb-24">
    <div data-testid="total-amount-text" class="content__topAmount align-self-end txt-gray">
        Total Amount:
        <span v-if="this.country">{{ currencyCode }}</span>
        <span class="total-po-amount"> {{ formattedTotalAmount }}</span>
    </div>

    <label
      v-if="!isTotalAmountExceedMax"
      data-testid="total-amount-note-text"
      class="total__info mb-0"
    >
      {{ getTextByCountry(countryCode, 'component_totalAmount_label_text', [currencyCode, formattedMaxTotalAmount])}}
    </label>

    <span
      v-else
      data-testid="total-amount-error"
      class="total-amount-error-message content__feedback"
    >
      {{ errorFn(formattedMaxTotalAmount, formattedExceedAmount, currencyCode) }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTextByCountry } from '@/utils/displayTextResources'

export default {
  props: {
    totalAmount: {
      type: Number,
      required: true
    },

    errorFn: {
      type: Function,
      required: true
    },

    countryCode: {
      type: String
    }
  },

  computed: {
    ...mapGetters({
      country: 'settings/country'
    }),

    maxTotalAmount () {
      if (!this.country || !this.country.defaultCurrency) {
        return 0
      }

      return this.country.defaultCurrency.bankMaxAmount
    },

    currencyCode () {
      if (!this.country || !this.country.defaultCurrency) {
        return ''
      }
      return this.country.defaultCurrency.code
    },

    formattedTotalAmount () {
      if (!this.country || !this.country.defaultCurrency) {
        return ''
      }

      return this.numberFormatter(this.country.defaultCurrency.thousandSeparator, this.country.defaultCurrency.decimalPlaces, this.totalAmount)
    },

    isTotalAmountExceedMax () {
      return this.totalAmount > this.maxTotalAmount
    },

    formattedMaxTotalAmount () {
      if (!this.country || !this.country.defaultCurrency) {
        return 0
      }

      return this.numberFormatter(
        this.country.defaultCurrency.thousandSeparator,
        this.country.defaultCurrency.decimalPlaces,
        this.maxTotalAmount
      )
    },

    formattedExceedAmount () {
      if (!this.country || !this.country.defaultCurrency) {
        return ''
      }

      const calculate = parseInt('1'.padEnd(parseInt(this.country.defaultCurrency.decimalPlaces) + 1, '0'))
      const amountExceed = (this.totalAmount * calculate - this.maxTotalAmount * calculate) / calculate
      return this.numberFormatter(this.country.defaultCurrency.thousandSeparator, this.country.defaultCurrency.decimalPlaces, amountExceed)
    }
  },

  methods: {
    getTextByCountry
  }
}
</script>

<style lang="scss" scoped>
  .total-amount-error-message {
    white-space: pre-wrap;
    text-align: right;
  }
</style>
