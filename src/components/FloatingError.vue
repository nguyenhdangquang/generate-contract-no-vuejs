<template lang="html">
  <div id="floating-container" v-if="floatingErrors.length > 0" class="justify-content-center align-self-center">
    <p data-testid="title-errors">You have <span style="color: red; font-weight: bold">{{ floatingErrors.length }}</span> invalid record(s). Please edit to continue</p>
  </div>
</template>

<script>
export default {
  name: 'FloatingErrors',
  props: {
    floatingErrors: {
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
  p {
    margin-bottom: 0;
  }
  #floating-container {
    top: 105px;
    height: 45px;
    border-radius: 7px;
    background-color: #fff;
    display: table;
    justify-content: space-between;
    padding: 16px 32px;
    align-self: center;
    box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 5%), 0px 4px 4px 0px rgb(0 0 0 / 5%);
    position: fixed;
    z-index: 999;
    left: 50%;
    transform: translate(-50%, 0);
    color: black;

    @media screen and (max-width: 768px) {
      width: auto;
      height: 40px;
      p {
        font-size: 16px;
      }
    }
  }
  .controller-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 100px;

    img {
      cursor: pointer;
    }
  }
</style>
