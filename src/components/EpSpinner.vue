<template>
  <svg class="ep-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle
      class="circle"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />

    <path
      class="path"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.ep-spinner {
  animation: spin 1s linear infinite;
  width: 1.5rem;
  height: 1.5rem;
  color: #BD0F72;

  .circle {
    opacity: 0.25;
  }

  .path {
    opacity: 0.75;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
