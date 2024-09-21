<template>
  <div class="mb-16 pl-24 pr-24">
    <div class="row d-flex align-items-end m-0">
      <div class="col-3 col-lg-3 pl-8 pr-16">
        <EpLabel class="form__label mb-0">{{ getTextByCountry(countryCode, 'component_epPOPaymentHeader_poNo_title') }}</EpLabel>
      </div>
      <div class="col-3 col-lg-2 pl-16">
          <div class="row m-0">
              <div class="col-6 col-lg-6 p-0">
                  <EpLabel class="form__label mb-0">Records</EpLabel>
              </div>
              <div class="col-6 col-lg-6">
                  <EpLabel class="form__label mb-0">Currency</EpLabel>
              </div>
          </div>
      </div>
      <div class="col-6 col-lg-7">
        <div class="row">
          <div class="col-4 col-lg-3 text-right pr-24">
            <EpLabel class="form__label mb-0">Amount</EpLabel>
          </div>
          <div class="col-8 col-lg-9 pl-24">
            <EpLabel class="form__label mb-0">Company Name</EpLabel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EpLabel from '../atoms/EpLabel'
import { getTextByCountry } from '../../utils/displayTextResources'
export default {
  components: {
    EpLabel
  },
  props: {
    countryCode: {
      type: String,
      default: 'SG'
    }
  },
  methods: {
    getTextByCountry
  }
}
</script>
