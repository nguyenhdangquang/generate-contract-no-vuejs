<template>
 <div class="po-content" data-testid="po-row">
   <div class="po__page mb-48">
    <div class="row justify-content-between m-0">
      <div class="col-3 col-lg-3 content__total-row-border-less d-flex justify-content-end align-self-center pr-8">
          <EpLabel class="mb-0">Total</EpLabel>
      </div>
      <div class="col-9 col-lg-9 d-flex pl-lg-3 pr-0 align-self-center">
        <div>
          <EpLabel
            data-testid="total-rows-text"
            class="content__total-row mb-0"
            :class="{
              'text-danger': blsCountExceedMax,
              'border-danger': blsCountExceedMax
            }"
            >
            {{ blsCount }} / {{ maxBls }}
          </EpLabel>
        </div>
          <div class="w-100 pl-2 pr-2">
            <div v-if="blsCountExceedMax || posCountExceedMax" class="row ep__laptop__display-error h-100">
              <div v-if="blsCountExceedMax" class="col align-self-center error-message text-left">
                {{ getTextByCountry(countryCode, 'payPOPage_totalBLRecords_label_errorMsg_reachedMax', [maxBls]) }}
              </div>
              <div v-if="posCountExceedMax && !blsCountExceedMax" class="col align-self-center error-message text-right">
                {{ getTextByCountry(countryCode, 'payPOPage_totalPORecords_label_errorMsg_reachedMax', [maxPos]) }}
              </div>
            </div>
          </div>
          <div>
          <EpIconButton
              :disabled="shouldDisableAddButton"
              color="primary"
              class="add-button"
              @click="$emit('add')">
            <AddIcon alt="Add icon" />
          </EpIconButton>
          </div>
      </div>
    </div>
    <div v-if="blsCountExceedMax || posCountExceedMax" class="row ml-0 mr-0 mt-2 ep__tablet_display-error">
      <div class="col-3 col-lg-3"></div>
      <div class="col-9 col-lg-9 align-self-center">
        <div v-if="blsCountExceedMax" class="error-message text-left">
          {{ getTextByCountry(countryCode, 'payPOPage_totalBLRecords_label_errorMsg_reachedMax', [maxBls]) }}
        </div>
        <div v-if="posCountExceedMax && !blsCountExceedMax" class="error-message text-right">
          {{ getTextByCountry(countryCode, 'payPOPage_totalPORecords_label_errorMsg_reachedMax', [maxPos]) }}
        </div>
      </div>
    </div>
  </div>
 </div>
</template>
<script>
import EpIconButton from '../EpIconButton.vue'
import EpLabel from '../atoms/EpLabel'
import AddIcon from '../icons/AddIcon.vue'
import { getTextByCountry } from '@/utils/displayTextResources'

export default {
  components: {
    EpIconButton,
    EpLabel,
    AddIcon
  },

  props: {
    maxBls: {
      type: Number,
      required: true
    },

    blsCount: {
      type: Number,
      required: true
    },

    posCount: {
      type: Number,
      required: true
    },

    maxPos: {
      type: Number,
      required: true
    },

    countryCode: {
      type: String
    }
  },

  computed: {
    shouldDisableAddButton () {
      return this.blsCountReachedMax || this.posCountExceedMax
    },

    blsCountReachedMax () {
      return this.blsCount >= this.maxBls
    },

    blsCountExceedMax () {
      return this.blsCount > this.maxBls
    },

    posCountExceedMax () {
      return this.posCount >= this.maxPos
    }
  },

  methods: {
    getTextByCountry
  }
}
</script>

<style lang="scss" scoped>
.add-button {
  background-color: #fff;
  border: 1px solid #F1F1F1;
  padding: 10px;
  border-radius: 5px;
}

.text-danger {
  color: #ff0000 !important;
}

.error-message {
  color: #FF0000;
}

.border-danger {
  border-color: #ff0000 !important;
}

.content__total-row {
  padding-bottom: 11px;
  padding-top: 11px;
  padding-right: 8Px;
  padding-left: 8px;
  white-space: nowrap;
  width: max-content;
  display: flex;
  border: 1px solid #E1E1E1;
  box-sizing: border-box;
  border-radius: 5px;
}

.content__total-row-border-less {
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
}

@media (min-width: 1024px) {
  .ep__tablet_display-error {
    display: none !important;
  }
  .ep__paymentrow__col-2 {
    flex: 0 0 11.66667% !important;
    max-width: 11.66667% !important;
  }
  .ep__paymentrow__col-7 {
    flex: 0 0 63.3333% !important;
    max-width: 63.3333% !important;
  }
}

@media (max-width: 1023px) {
  .ep__laptop__display-error {
    display: none !important;
  }
}

</style>
