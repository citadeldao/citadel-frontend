<template>
  <div class="wallet-type-card" :class="typeClass">
    <div :style="{ backgroundColor: typeObject.color }" />
    <span :style="{ color: typeObject.color }">
      {{ typeObject.text }}
    </span>
  </div>
</template>

<script>
import { computed } from 'vue';
import { types } from '@/config/walletType';
export default {
  name: 'WalletTypeCard',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const typeClass = computed(() => `wallet-type-card__${props.type}`);
    const typeObject = computed(() => types[props.type]);

    return { typeClass, typeObject };
  },
};
</script>

<style lang="scss" scoped>
.wallet-type-card {
  height: 30px;
  border-radius: 4px;
  padding: 0 11px;
  display: flex;
  align-items: center;
  position: relative;

  &::after {
    content: '';
    opacity: 0.2;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    border-radius: 4px;
  }

  & div {
    width: 11px;
    height: 11px;
    margin-right: 8px;
    border-radius: $round;
    @include md {
      width: 8px;
      height: 8px;
    }
  }

  & span {
    font-size: 14px;
    line-height: 17px;
    white-space: nowrap;
    @include md {
      font-size: 12px;
      line-height: 14px;
    }
  }

  &__trezor {
    &::after {
      background: $green;
    }
  }

  &__ledger {
    &::after {
      background: $green;
    }
  }

  &__oneSeed {
    &::after {
      background: $dark-blue;
    }
  }

  &__privateKey {
    &::after {
      background: $ligth-blue;
    }
  }

  &__publicKey {
    &::after {
      background: $orange;
    }
  }

  &__metamask {
    &::after {
      background: #ffb03a;
    }
  }

  &__keplr {
    &::after {
      background: #e336e7;
    }
  }
}
</style>
