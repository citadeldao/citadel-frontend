<template>
  <button
    :id="id"
    :style="cssVars"
    :disabled="disabled"
    class="primary-button"
    :class="{ 'no-decoration': noDecoration, loading }"
    :data-qa="dataQa"
    @click="loading ? () => {} : $emit('click', $event)"
  >
    <loadingIcon v-if="loading" class="rotating" />
    <slot v-else />
  </button>
</template>

<script>
import loadingIcon from '@/assets/icons/load-btn.svg';

export default {
  components: { loadingIcon },
  name: 'PrimaryButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
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
    id: {
      type: String,
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
  font-family: 'Panton_SemiBold';
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

  &.loading {
    background: #c3ceeb;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 7px;
    }
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

@-webkit-keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}

body.dark {
  .primary-button {
    box-shadow: none;

    &:disabled,
    & [disabled] {
      background: #393b53;
    }
  }
}
</style>
