<template>
  <button
    :style="cssVars"
    :disabled="disabled"
    class="primary-button"
    :class="{ 'no-decoration': noDecoration }"
    :data-qa="dataQa"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'PrimaryButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: '#6A4BFF',
    },
    color: {
      type: String,
      default: '#FFFFFF',
    },
    hoverColor: {
      type: String,
      default: '#FFFFFF',
    },
    hoverBgColor: {
      type: String,
      default: '#1A53F0',
    },
    noDecoration: {
      type: Boolean,
      default: false,
    },
    boxShadow: {
      type: String,
      default: '0px 0px 25px rgba(106, 75, 255, 0.3)',
    },
    border: {
      type: String,
      default: 'none',
    },
    hoverBorder: {
      type: String,
      default: 'none',
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['click'],
  computed: {
    cssVars() {
      return {
        '--backgroundColor': this.bgColor,
        '--textColor': this.color,
        '--hoveredColor': this.hoverColor,
        '--hoverededBgColor': this.hoverBgColor,
        '--buttonShadow': this.boxShadow,
        '--buttonBorder': this.border,
        '--buttonHoverBorder': this.hoverBorder,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.primary-button {
  width: 200px;
  min-height: 60px;
  border-radius: 50px;
  box-shadow: var(--buttonShadow);
  font-family: "Panton_SemiBold";
  font-size: 20px;
  line-height: 24px;
  background: var(--backgroundColor);
  color: var(--textColor);
  border: var(--buttonBorder);
  z-index: 1;
  @include lg {
    width: 160px;
    min-height: 56px;
    font-size: 14px;
    line-height: 17px;
  }
  @include md {
    width: 120px;
    min-height: 40px;
    font-size: 14px;
    line-height: 17px;
  }
  &:hover {
    background: var(--hoverededBgColor);
    color: var(--hoveredColor);
    border: var(--buttonHoverBorder);
  }
  &:disabled,
  & [disabled] {
    background: $too-ligth-blue;
    cursor: pointer;
    box-shadow: none;
    pointer-events: none;
  }
}

.no-decoration {
  font-family: 'Panton_Bold';
  font-size: 18px;
  line-height: 27px;
  color: $too-dark-blue;
  width: auto;
  min-height: auto;
  box-shadow: none;
  text-decoration: underline;
  background: none;
  @include md {
    width: auto;
    min-height: auto;
  }
  &:hover {
    background: none;
    color: $blue;
    box-shadow: none;
  }
  &:disabled,
  & [disabled] {
    background: none;
    cursor: pointer;
    box-shadow: none;
    color: $mid-gray;
  }
}
</style>
