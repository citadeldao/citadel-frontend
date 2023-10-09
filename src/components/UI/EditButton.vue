<template>
  <button :disabled="disabled" class="edit-button" @click.stop="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'EditButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
button {
  background: none;
}

.edit-button {
  background: $orange-with-op;
  color: $orange;
  height: 30px;
  min-width: 40px;
  font-family: 'Panton_Bold';
  font-size: 14px;
  line-height: 17px;
  border-radius: 4px;
  position: relative;

  @include md {
    font-size: 12px;
  }

  &:hover {
    background: $ligth-blue-with-op;
    color: $ligth-blue;
  }
  &:disabled,
  & [disabled] {
    background: $mid-gray-with-op;
    cursor: pointer;
    color: $mid-gray;
  }
}

body.dark {
  .edit-button {
    background: transparent;
    color: $dark-orange;
    border: 1px solid $dark-orange;
  }
}
</style>
