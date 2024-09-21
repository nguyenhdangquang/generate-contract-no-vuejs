<template>
  <input
    :value="value"
    @input="$emit('input', $event)"
    @blur="$emit('blur', $event)"
  />
</template>
<script>
export default {
  props: {
    value: {
      type: String
    }
  }
}
</script>
