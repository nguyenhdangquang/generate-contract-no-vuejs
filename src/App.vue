<template>
  <div class="ep__app_container">
    <router-view />
    <ErrorDialog
      :isOpen="!!globalError"
      :title="globalError ? globalError.title : null"
      :description="globalError ? globalError.message : null"
      @update:isOpen="handleErrorUpdateIsOpen"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ErrorDialog from './components/dialog/ErrorDialog.vue'

export default {
  name: 'App',

  components: {
    ErrorDialog
  },

  computed: {
    ...mapGetters({
      globalError: 'application/error'
    })
  },

  methods: {
    ...mapActions({
      clearGlobalError: 'application/clearError'
    }),

    handleErrorUpdateIsOpen (isOpen) {
      if (!isOpen) {
        this.clearGlobalError()
      }
    }
  }
}
</script>
<style scoped>
.ep__app_container {
  min-height: 100vh;
}
</style>
