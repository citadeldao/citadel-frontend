<template>
  <button
    :style="cssVars"
    :disabled="disabled"
    class="round-arrow-button"
    @click="$emit('click')"
  >
    <span v-if="text" class="round-arrow-button__text">
      {{ $t(text) }}
    </span>
    <div class="round-arrow-button__icon">
      <arrowRigth
        :class="{
          down: arrow === 'down',
          left: arrow === 'left',
          up: arrow === 'up',
        }"
      />
    </div>
  </button>
</template>

<script>
import arrowRigth from '@/assets/icons/arrow-rigth.svg';
import { computed } from '@vue/runtime-core';

export default {
  name: 'RoundArrowButton',
  components: { arrowRigth },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    arrow: {
      type: String,
    },
    bgColor: {
      type: String,
      default: '#6A4BFF',
    },
    iconFill: {
      type: String,
      default: 'white',
    },
    hoverBgColor: {
      type: String,
      default: '#1A53F0',
    },
    textColor: {
      type: String,
      default: '#0A2778',
    },
    hoverIconFill: {
      type: String,
      default: 'white',
    },
    hoverTextColor: {
      type: String,
      default: '#1A53F0',
    },
    text: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props) {
    const cssVars = computed(() => ({
      '--backgroundColor': props.bgColor,
      '--iconFillColor': props.iconFill,
      '--hoverIconFillColor': props.hoverIconFill,
      '--hoverBgColor': props.hoverBgColor,
      '--textColor': props.textColor,
      '--hoverTextColor': props.hoverTextColor,
    }));

    return { cssVars };
  },
};
</script>

<style lang="scss" scoped>
.round-arrow-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  padding: 0;

  &:hover {
    .round-arrow-button__icon {
      background: var(--hoverBgColor);

      & svg {
        fill: var(--hoverIconFillColor);
      }
    }

    .round-arrow-button__text {
      color: var(--hoverTextColor);
    }
  }

  &__text {
    margin-right: 15px;
    font-size: 18px;
    line-height: 22px;
    color: var(--textColor);
    font-family: 'Panton_Bold';
    @include md {
      font-size: 14px;
      line-height: 17px;
      margin-right: 8px;
    }
  }

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $round;
    background: var(--backgroundColor);
    box-shadow: 0px 4px 20px rgba(105, 95, 225, 0.7);

    & svg {
      width: 9px;
      height: 14px;
      fill: var(--iconFillColor);
      transition: none;
      @include md {
        width: 7px;
        height: 12px;
      }
    }

    @include md {
      width: 34px;
      height: 34px;
    }
  }

  &:disabled,
  & [disabled] {
    cursor: default;

    .round-arrow-button__text {
      color: $mid-gray;
    }

    .round-arrow-button__icon {
      background: $lavander-dark;
      box-shadow: none;
      cursor: default;

      & svg {
        fill: $too-ligth-blue;
      }
    }
  }
}

.down {
  transform: rotate(90deg);
}

.left {
  transform: rotate(180deg);
}

.up {
  transform: rotate(270deg);
}
</style>
