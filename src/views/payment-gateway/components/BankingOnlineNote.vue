<template>
  <div class="content__frame d-flex align-items-center h-100 pl-24 pt-32 pb-32 margin-top-16 font-16 important-text-note">
    <div>
      <span class="txt-bold">For Singapore PayNow Only: </span>
      <span>
        You can also pay using Online Banking with PayNow method. Please
        <a data-testid="click-here" @click="handleClickhereBankingOnlinePayNow"><span class="click-here-highlight">click here</span></a> to continue.
      </span>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    handleClickhereBankingOnlinePayNow () {
      this.$emit('clickHereBankingOnlinePayNow')
    }
  }
}
</script>
<style scoped>
@media (max-width: 991px) {
  .margin-top-16 {
    margin-top: 0px !important;
  }
}
@media (min-width: 992px) {
  .margin-top-16 {
    margin-top: 16px !important;
  }
}

.margin-top-16 {
  margin-top: 16px;
}

.important-text-note {
  line-height: 20px !important;
}

.click-here-highlight {
  color: #bd0f72;
  text-decoration: underline;
  font-weight: bold;
}

.click-here-highlight:hover {
  cursor: pointer;
}
</style>
