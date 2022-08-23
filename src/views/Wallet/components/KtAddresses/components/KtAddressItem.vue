<template>
  <div class="kt-address-item" :class="{ main: type === 'main', isChecked }">
    <div>
      <span ref="address" class="kt-address-item__address">
        <resize-observer :show-trigger="true" @notify="handleResize" />
        {{ formatedAddress }}
      </span>
      <div class="kt-address-item__balance">
        <span
          v-pretty-number="{
            value: item.balance.calculatedBalance,
            currency: currentWallet.code,
          }"
          class="kt-address-item__balance-value"
        />
        <span class="kt-address-item__balance-currency">
          {{ currentWallet.code }}
        </span>
      </div>
    </div>

    <div
      class="input__copy"
      :style="{ borderLeftColor: type === 'main' ? '#6a4bff' : '#1a53f0' }"
    >
      <copy @click.stop="copyValue" />
      <transition name="fade1">
        <span v-if="isCopied" class="input__tooltip">
          {{ $t('copiedToClipboard') }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { formattedWalletAddress } from '@/helpers';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
import copy from '@/assets/icons/copy.svg';
import copyToClipboard from '@/helpers/copyToClipboard';
export default {
  name: 'KtAddressItem',
  components: { copy },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    currentWallet: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { width } = useWindowSize();
    const address = ref(null);
    const wrapperWidth = ref();
    const handleResize = ({ width }) => {
      wrapperWidth.value = width;
    };
    const isCopied = ref(false);
    const maxWidth = computed(() => (width.value < screenWidths.xl ? 97 : 115));
    const formatedAddress = computed(() =>
      formattedWalletAddress(
        props.item.address,
        maxWidth.value,
        'Panton_SemiBold',
        16
      )
    );
    const copyValue = () => {
      copyToClipboard(props.item.address);
      isCopied.value = true;

      setTimeout(() => {
        isCopied.value = false;
      }, 1500);
    };
    return {
      copyValue,
      isCopied,
      address,
      wrapperWidth,
      handleResize,
      formatedAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
.input {
  &__copy {
    display: flex;
    align-items: center;
    position: relative;
    border-left: 1px dashed #1a53f0;
    & svg {
      width: 22.9px;
      margin-left: 17px;
      fill: #1a53f0;
    }
  }
  &__tooltip {
    background-color: $too-ligth-gray;
    text-align: center;
    border-radius: 6px;
    padding: 8px 9px;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
    top: 30px;
    left: 69%;
    transform: translate(-50%, 7px);
    box-shadow: 0 4px 25px rgba(63, 54, 137, 0.25);
    font-size: 12px;
    line-height: 16px;
    color: $too-dark-blue;

    &::after {
      content: '';
      position: absolute;
      bottom: 98%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-radius: 2px;
      border-style: solid;
      border-color: transparent transparent $too-ligth-gray transparent;
    }
  }
}
.kt-address-item {
  width: 100%;
  max-width: 290px;
  height: 64px;
  border-radius: 8px;
  padding: 12px 16.71px 12px 16px;
  display: flex;
  background: $info-block-bg-with-op;
  margin-right: 10px;
  align-items: center;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    cursor: pointer;
    background: $white;
    box-shadow: 8px 9px 15px rgba(80, 100, 124, 0.16%);
    border-radius: 8px;
    .kt-address-item__address {
      color: $blue;
    }
  }

  @include md {
    max-width: 228px;
  }
  &__address {
    display: flex;
    font-size: 16px;
    line-height: 19px;
    position: relative;
    margin-bottom: 6px;
    color: $blue;
    max-width: 115px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 100px;
    @include lg {
      margin-bottom: 9px;
      max-width: 97px;
    }
    @include md {
      margin-right: 54px;
    }
    @include laptop {
      font-size: 14px;
    }
  }
  &__balance {
    display: flex;
    align-items: baseline;
  }
  &__balance-value,
  &__balance-currency {
    font-size: 14px;
    line-height: 17px;
    color: #1a53f0;
  }
  &__balance-value {
    font-family: 'Panton_Bold' !important;
    color: $too-dark-blue;
    margin-right: 3px;
  }
}
.main {
  background: rgba(106, 75, 255, 0.15) !important;
  .kt-address-item__address {
    color: #6a4bff !important;
  }
  .kt-address-item__balance-currency {
    color: #6a4bff !important;
  }
}
.isChecked {
  &:hover {
    background: $white;
  }
}
</style>
