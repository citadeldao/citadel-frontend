<template>
  <div class="tooltip">
    <slot />
    <div class="tooltip__content" :style="{ width, left }">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    width: {
      type: String,
    },
    left: {
      type: String,
    },
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
.tooltip {
  position: relative;
  cursor: pointer;
  &:hover {
    .tooltip__content {
      display: flex;
    }
  }
  &__content {
    background: $white;
    box-shadow: 0 4px 25px rgba(63, 54, 137, 0.25);
    border-radius: 6px;
    display: none;
    padding: 11px;
    position: absolute;
    z-index: 1001;
    top: 22px;
    &::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      top: -4px;
      transform: rotate(45deg);
      margin-left: -5px;
      border-radius: 2px;
      width: 10px;
      height: 10px;
      background: $white;
    }
  }
}
</style>
