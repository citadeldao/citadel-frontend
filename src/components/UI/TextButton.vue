<template>
  <button
    :disabled="disabled"
    :data-qa="dataQa"
    class="text-button"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'TextButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['click'],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.text-button {
  font-size: 18px;
  line-height: 19px;
  padding: 0;
  border-bottom: 2px solid $too-dark-blue;
  color: $too-dark-blue;
  font-family: 'Panton_Bold';
  background: transparent;

  &:hover {
    color: $dark-blue;
    border-color: $dark-blue;
  }

  &:disabled,
  & [disabled] {
    color: $mid-gray;
    border-color: $mid-gray;
  }
}
</style>
