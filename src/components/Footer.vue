<template>
  <footer class="footer">
        <div class="container">
            <div class="footer__text font-16 d-flex align-items-center sm-footer">
                <div>
                    <span>© Ocean Network Express Pte. Ltd. All rights reserved.</span>
                    <span class="ml-8 mr-8"> </span><router-link :to="`/${countryCode}/terms-of-use`" class="underline" target='_blank' >Terms of Use</router-link>
                    <span class="ml-8 mr-8"> - </span><router-link :to="`/${countryCode}/user-guide`" class="underline" target='_blank'>User Guide</router-link>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
export default {
  name: 'Footer',
  props: {
    countryCode: {
      type: String
    }
  }
}
</script>
