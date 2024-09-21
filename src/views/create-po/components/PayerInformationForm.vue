<template>
  <div class="content__frame mb-70 p-24">
    <div class="row">
      <div class="col-lg-4">
        <div class="d-flex flex-column">
          <label class="form__label">Company name</label>
            <input
              :value="companyName"
              id="company-name-input"
              name="company-name-input"
              type="text"
              class="form__control"
              :class="{ 'error-controls': !!errors && !!errors.companyNameError, 'disable-color-input': readonlyMode }"
              placeholder="Please input company name"
              maxlength="200"
              @blur="handleCompanyNameBlur"
              @input="handleCompanyNameInput"
              :disabled="readonlyMode"
            />
            <label class="form__valid mb-0 mt-8">Max length 200 characters</label>
            <span
              v-if="!!errors && !!errors.companyNameError"
              data-testid="company-name-error"
              class="content__feedback content__feedback__payerinformation"
            >
              {{ errors.companyNameError }}
            </span>
        </div>
      </div>
      <div class="col-lg-4 mb-768-16">
        <div class="d-flex flex-column">
            <label class="form__label">Email address</label>
            <input
              :value="email"
              id="email-input"
              name="email-input"
              type="text"
              class="form__control"
              :class="{ 'error-controls': !!errors && !!errors.emailError, 'disable-color-input': readonlyMode }"
              :placeholder="getTextByCountryCode(countryCode, 'component_payerInformation_emailTextBox_placeHolder')"
              maxlength="200"
              @blur="handleEmailBlur"
              @input="handleEmailInput"
              :disabled="readonlyMode"
            />
            <label class="form__valid mb-0 mt-8">Ex: aaa@aaaaa.com</label>
            <span
              v-if="!!errors && !!errors.emailError"
              data-testid="email-error" class="content__feedback content__feedback__payerinformation"
            >
              {{ errors.emailError }}
            </span>
        </div>
      </div>
      <div class="col-lg-4">
          <div class="d-flex flex-column">
              <label class="form__label">Contact number</label>
              <div
                class="input-group"
                data-testid="contact-number-group"
                :class="{ 'error-controls': !!errors && !!errors.contactNumberError }">
                  <div class="input-group-prepend">
                    <EpDropdown
                      :selectedItem="contactInfo"
                      :items="COUNTRY_CONTACT"
                      :disabled="readonlyMode"
                      itemKey="countryCode"
                      @update:selectedItem="handleUpdateContactNumber"
                    >
                      <template #selectedItem="{ selectedItem }">
                        <button
                          class="btn form__phone d-flex justify-content-between align-items-center txt-black pl-16 pr-16 position-relative h-100"
                          type="button"
                          :disabled="readonlyMode"
                        >
                          <img
                            :src="selectedItem.urlImage"
                            alt="flag-icon"
                            class="mr-8"
                            width="32"
                            height="32"
                          />
                          {{ selectedItem.countryCode }}
                          <img src="/img/dropdown.svg" alt="dropdown" class="img-24 ml-8" />
                        </button>
                      </template>

                      <template #item="{ item }">
                        <img :src="item.urlImage" :alt="item.countryValue" width="32" height="32" class="mr-16">
                        <span class="mr-2">{{ item.countryName }}</span><span>{{ item.countryCode }}</span>
                      </template>
                    </EpDropdown>
                  </div>
                  <input
                    :value="contactNumber"
                    id="contact-number-input"
                    name="contact-number-input"
                    type="tel"
                    class="form__control contact-no"
                    :class="{ 'error-controls-only-background': !!errors && !!errors.contactNumberError, 'disable-color-input': readonlyMode }"
                    aria-label="Text input with dropdown button"
                    placeholder="Please input your contact number"
                    maxlength="12"
                    @blur="handleContactNumberBlur"
                    @keypress="handleContactNumberKeypress"
                    @input="handleContactNumberInput"
                    :disabled="readonlyMode"
                  >
              </div>
              <label class="form__valid mb-0 mt-8">Max length 12 digits</label>
              <span
                v-if="!!errors && !!errors.contactNumberError"
                class="content__feedback"
                data-testid="contact-number-error"
              >
                {{ errors.contactNumberError }}
              </span>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import EpDropdown from '@/components/EpDropdown.vue'
import { getTextByCountry } from '@/utils/displayTextResources'
export default {
  components: { EpDropdown },
  props: {
    companyName: {
      type: String
    },

    email: {
      type: String
    },

    contactNumber: {
      type: String
    },

    errors: {
      type: Object,
      default: null
    },

    contactInfo: {
      type: Object,
      default () {
        return {
          urlImage: require('../../../../static/img/flag-sg.svg'),
          isoCode: 'SG',
          countryCode: '+65',
          countryName: 'Singapore'
        }
      }
    },

    readonlyMode: {
      type: Boolean,
      default: false
    },

    countryCode: {
      type: String
    }
  },

  created () {
    this.COUNTRY_CONTACT = [
      {
        urlImage: require('../../../../static/img/flag-sg.svg'),
        isoCode: 'SG',
        countryCode: '+65',
        countryName: 'Singapore'
      },
      {
        urlImage: require('../../../../static/img/flag-hk.svg'),
        isoCode: 'HK',
        countryCode: '+852',
        countryName: 'Hong Kong'
      },
      {
        urlImage: require('../../../../static/img/flag-macau.svg'),
        isoCode: 'MO',
        countryCode: '+853',
        countryName: 'Macau'
      },
      {
        urlImage: require('../../../../static/img/flag-china.svg'),
        isoCode: 'CN',
        countryCode: '+86',
        countryName: 'China'
      },
      {
        urlImage: require('../../../../static/img/flag-id.svg'),
        isoCode: 'ID',
        countryCode: '+62',
        countryName: 'Indonesia'
      },
      {
        urlImage: require('../../../../static/img/flag-th.svg'),
        isoCode: 'TH',
        countryCode: '+66',
        countryName: 'Thailand'
      }
    ]
  },

  methods: {
    getTextByCountryCode (countryCode, text) {
      return getTextByCountry(countryCode.toUpperCase(), text)
    },

    handleCompanyNameBlur (event) {
      this.$emit('companyNameBlur', event)
    },

    handleEmailBlur (event) {
      this.$emit('emailBlur', event)
    },

    handleContactNumberBlur (event) {
      this.$emit('contactNumberBlur', event)
    },

    handleContactNumberKeypress (event) {
      this.$emit('contactNumberKeypress', event)
    },

    handleCompanyNameInput (event) {
      this.$emit('update:companyName', event.target.value)
    },

    handleEmailInput (event) {
      this.$emit('update:email', event.target.value)
    },

    handleContactNumberInput (event) {
      this.$emit('update:contactNumber', event.target.value)
    },

    handleUpdateContactNumber (item) {
      this.$emit('switchCountryContact', item.isoCode)
    }
  }
}
</script>
<style scoped>
button:disabled {
  cursor: not-allowed
}
</style>
