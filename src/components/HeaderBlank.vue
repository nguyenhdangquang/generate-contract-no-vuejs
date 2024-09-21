<template>
  <!-- Begin Header -->
    <header class="header fixed-top w-100">
        <div class="d-flex justify-content-between align-items-center">
            <!-- Header Left -->
            <div class="header__left" >
              <router-link to="/">
                <img src="/img/logo.svg" alt=""/>
              </router-link>
            </div>
        </div>
    </header>
</template>
<script>
export default {
  name: 'HeaderBlank',

  props: { },

  methods: { }
}
</script>

<style lang="scss" scoped>
  .dropdown-item {
    cursor: pointer;
  }
</style>
