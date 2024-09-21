<template>
  <div>
    <Header/>
    <slot />
    <Footer />
  </div>
</template>
<script>

import Header from '@/components/HeaderBlank.vue'
import Footer from '@/components/FooterBlank.vue'

export default {
  components: {
    Header,
    Footer
  },

  props: {
    hasChangedData: {
      type: Boolean,
      default: false
    }
  }
}
</script>
