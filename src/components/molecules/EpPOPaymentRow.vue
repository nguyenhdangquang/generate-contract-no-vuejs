<template>
 <div class="po-content" data-testid="po-row">
   <div class="content__frame po__page mb-8" id="div-content">
    <div class="row m-0">
      <div class="col-3 col-lg-3 pr-16 align-self-center">
          <div class="d-flex row m-0">
              <div class="form__rowNum ordinal-no col-1 p-0">{{ index + 1 }}.</div>
              <div class="col-11 d-flex flex-column w-100 pl-sm-3 pr-0">
                  <EpInput
                    aria-label="Po number"
                    type="text"
                    class="form__control"
                    :class="{'error-controls': poItem.error}"
                    :placeholder="getTextByCountry(countryCode, 'component_epPOPaymentRow_poInput_placeholder')"
                    :value="poItem.poNumber"
                    @blur="handlePoNumberInputBlur"
                    @input="handlePoNumberChange"
                    :maxlength="12"
                  />
              </div>
          </div>
      </div>
      <div class="col-3 col-lg-2 pl-16 align-self-center">
        <div class="row m-0">
          <div class="col-6 col-lg-6 p-0 m-0">
              <EpLabel class="label-display" data-testid="records-label">{{ poItem.records || '- - -' }}</EpLabel>
          </div>
          <div class="col-6 col-lg-6">
              <EpLabel data-testid="currency-label" class="form__txtCurrency label-display">{{ poItem.currency }}</EpLabel>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-7 align-self-center">
        <div class="row">
          <div class="col-4 col-lg-3 text-right pr-24 align-self-center">
              <EpLabel
                v-if="poItem.amount"
                data-testid="amount-label"
                class="amount-text label-display"
              >
                {{ poItem.amount }}
              </EpLabel>
              <span v-else data-testid="amount-label">
                - - -
              </span>
          </div>
          <div class="col-8 col-lg-9 pl-24 pr-0">
            <div class="row m-0">
              <div class="col-8 col-lg-10 p-0 align-self-center">
                <EpLabel class="label-display txt-break-word" data-testid="company-name-label">{{ poItem.companyName || '- - -' }}</EpLabel>
              </div>
              <div class="col-4 col-lg-2 pr-0 align-self-center">
                <div class="d-flex form__delete float-right">
                  <EpIconButton @click="handleRemoveButtonClick" data-testid="remove-button" class="p-sm-0 bd-t-none">
                    <DeleteIcon />
                  </EpIconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="poItem.error" class="row m-0">
      <div class="col-12 col-lg-3">
          <div class="d-flex row m-0">
              <div class="form__rowNum ordinal-no col-1 p-0 rowNum__custom"></div>
              <div data-testid="error-message" class="d-flex flex-column w-100 pr-2 pl-sm-3 col-11 content__feedback font-16">
                  {{ poItem.error ? poItem.error.message : '' }}
              </div>
          </div>
      </div>
    </div>
  </div>
 </div>
</template>
<script>
import EpIconButton from '@/components/EpIconButton.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import EpLabel from '../atoms/EpLabel'
import EpInput from '../atoms/EpInput'
import { getTextByCountry } from '../../utils/displayTextResources'

export default {
  components: {
    EpLabel,
    EpInput,
    EpIconButton,
    DeleteIcon
  },

  props: {
    poItem: {
      type: Object,
      required: true
    },

    index: {
      type: Number,
      default: 1
    },

    countryCode: {
      type: String,
      default: 'SG'
    }
  },

  methods: {
    getTextByCountry,

    handlePoNumberInputBlur () {
      this.$emit('blur')
    },

    handlePoNumberChange (event) {
      this.$emit('update:poNumber', event.target.value)
    },

    handleRemoveButtonClick () {
      this.$emit('remove')
    }
  }
}
</script>
<style lang="scss">
@media (max-width: 991px) {
  .rowNum__custom {
    max-width: 13.99px !important;
  }
}

.amount-text {
  color: #BD0F72;
  font-weight: bold;
}

.label-display {
  margin-bottom: 0;
}

.error-controls {
  background: #F5DBDC;
  border: 1px solid #FF0000;
}
</style>
