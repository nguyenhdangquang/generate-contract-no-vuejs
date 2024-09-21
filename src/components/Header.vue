<template>
  <!-- Begin Header -->
  <header id="ep__header" class="header w-100" :style="{ top: -this.top + 'px' }">
      <div class="d-flex justify-content-between align-items-center">
          <!-- Header Left -->
          <div class="header__left">
              <router-link :to="`/${currentFlag.countryCode.toLowerCase()}`"><img src="/img/logo.svg" alt="" /></router-link>
          </div>
          <!-- Header Right -->
          <div class="header__right d-flex align-items-center">
              <!-- Contact us Btn -->
              <router-link :to="`/${currentFlag.countryCode.toLowerCase()}/contact-us`" class="header__button text-decoration-none"><img src="/img/phone.svg" alt="">Contact us</router-link>
              <!-- Choose Country / Language -->
              <div class="header__form d-flex align-items-center">
                  <div>Country</div>
                  <EpDropdown
                    :items="flagList"
                    itemKey="countryCode"
                    :selectedItem="currentFlag"
                    @update:selectedItem="handleFlagChange"
                    dropdownClass="flag-dropdown"
                  >
                    <template #selectedItem="{ selectedItem }">
                      <div class="language-dropdown-trigger">
                        <img
                          :src="selectedItem.urlImage"
                          alt=""
                          height="32"
                          width="32"
                        />
                        <img
                          src="/img/dropdown.svg"
                          alt=""
                          class="img-24 ml-8"
                        />
                      </div>
                    </template>

                     <template #item="{ item }">
                      <img :src="item.urlImage" :alt="item.countryValue" height="32" width="32" class="mr-16" />
                      {{ item.countryValue }}
                    </template>
                  </EpDropdown>
                  <div class="header__label">Language</div>
                  <span class="header__lang">EN</span>
              </div>
          </div>
      </div>
  </header>
</template>
<script>
import EpDropdown from '@/components/EpDropdown.vue'

export default {
  name: 'Header',

  components: { EpDropdown },

  props: {
    currentFlag: {
      type: Object,
      default: () => ({
        urlImage: require('../../static/img/flag-sg.svg'),
        countryCode: 'SG',
        countryValue: 'Singapore'
      })
    },
    flagList: {
      type: Array,
      require: true
    }
  },

  data () {
    return {
      top: null,
      headerRange: 16
    }
  },

  mounted () {
    window.onscroll = this.handleScroll
  },

  destroyed () {
    window.onscroll = null
  },

  methods: {
    switchFlag (country) {
      this.$emit('flagChange', country)
    },

    handleFlagChange (item) {
      this.switchFlag(item.countryCode)
    },

    handleScroll () {
      if (window.pageYOffset > this.headerRange) {
        document.getElementById('ep__header').classList.add('header__sticky')
        this.calculatePosition()
      } else {
        document.getElementById('ep__header').classList.remove('header__sticky')
        this.top = null
      }
    },

    calculatePosition () {
      if (window.pageYOffset > this.headerRange && window.pageYOffset < this.headerRange * 2) {
        this.top = Math.round(window.pageYOffset - this.headerRange * 2) * -1
      } else {
        this.top = null
      }
    }
  }
}
</script>

<style lang="scss">
  .flag-dropdown {
    z-index: 1000;
  }

  .language-dropdown-trigger {
    padding: 0.375rem 1rem;

    &:hover {
      cursor: pointer;
    }
  }
</style>
