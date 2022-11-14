<template>
  <div class="balance-card" :class="`balance-card--${type}`" :style="cssVars">
    <img
      :src="require(`@/assets/images/waves/${type}.png`)"
      class="balance-card__wave"
    />
    <div class="balance-card__description">
      {{ text }}
    </div>
    <div class="balance-card__value">
      <span
        v-pretty-number="{ value, currency }"
        class="balance-card__amount"
      />
      <span class="balance-card__currency">{{ currency }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BalanceCard',
  props: {
    type: {
      type: String,
      default: 'red', // red, blue
    },
    text: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    bgColor: {
      type: String,
      default: '#FAD0C4',
    },
    valueColor: {
      type: String,
      default: '#6A4BFF',
    },
  },
  setup(props) {
    return {
      cssVars: {
        '--value-color': props.valueColor,
        '--bg-color': props.bgColor,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.balance-card {
  position: relative;
  min-height: 56px;
  max-height: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  padding: 0 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  @include md {
    height: 64px;
  }

  @include laptop {
    height: 56px;
  }

  &:not(:last-child) {
    margin-right: 8px;
  }

  & > *:not(img) {
    position: relative;
    z-index: 1;
  }

  &__wave {
    position: absolute;
    object-fit: cover;
    object-position: bottom;
    opacity: 0.2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-select: none;
  }

  &__description {
    margin-bottom: 5px;
    font-size: 14px;
    color: $slategray1;
    line-height: 1.1;
    white-space: nowrap;

    @include lg {
      font-size: 13px;
    }

    @include md {
      font-size: 12px;
    }
  }

  &__value {
    display: flex;
    font-size: 24px;
    line-height: 1.1;

    @include lg {
      font-size: 18px;
    }

    @include md {
      font-size: 14px;
    }
  }

  &__amount {
    font-family: 'Panton_Bold' !important;
    color: var(--value-color);
  }

  &__currency {
    color: $black;
    padding-left: 5px;
  }

  &--red {
    background: linear-gradient(
      90deg,
      rgba(250, 208, 196, 0.4) 0%,
      rgba(250, 208, 196, 0.4) 1%,
      rgba(255, 209, 255, 0.4) 100%
    );
  }

  &--blue {
    background: linear-gradient(
      90deg,
      rgba(161, 196, 253, 0.3) 0%,
      rgba(194, 233, 251, 0.3) 100%
    );
  }
}
</style>
