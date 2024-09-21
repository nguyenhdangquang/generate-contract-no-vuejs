<template>
  <footer class="footer fixed-bottom">
        <div class="container">
            <div class="footer__text d-flex align-items-center sm-footer">© Ocean Network Express Pte. Ltd. All rights
                reserved.
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
