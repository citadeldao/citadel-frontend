<template>
  <div class="kt-address-item" :class="{ main: type === 'main', isChecked }">
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
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { formattedWalletAddress } from '@/helpers';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
export default {
  name: 'KtAddressItem',
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
    const maxWidth = computed(() => (width.value < screenWidths.xl ? 97 : 255));
    const formatedAddress = computed(() =>
      formattedWalletAddress(
        props.item.address,
        maxWidth.value,
        'Panton_SemiBold',
        16
      )
    );

    return { address, wrapperWidth, handleResize, formatedAddress };
  },
};
</script>

<style lang="scss" scoped>
.kt-address-item {
  width: 308px;
  height: 80px;
  border-radius: 8px;
  padding: 21px 29px 0 24px;
  display: flex;
  flex-direction: column;
  background: $info-block-bg-with-op;
  margin-right: 14px;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    cursor: pointer;
    background: $white;
    box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
      0px 10px 15px rgba(80, 100, 124, 0.16);
    .kt-address-item__address {
      color: $blue;
    }
  }
  @include lg {
    width: 151px;
    padding: 18px 38px 0 16px;
    margin-right: 8px;
  }
  &__address {
    display: flex;
    font-size: 15px;
    line-height: 19px;
    position: relative;
    max-width: 255px;
    margin-bottom: 6px;
    color: $blue;
    @include lg {
      margin-bottom: 9px;
      max-width: 97px;
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
    color: $dark-blue;
  }
  &__balance-value {
    font-family: 'Panton_Bold' !important;
    color: $too-dark-blue;
    margin-right: 3px;
  }
}
.main {
  background: $dark-blue-with-op;
  .kt-address-item__address {
    color: $dark-blue;
  }
}
.isChecked {
  background: $blue;
  &:hover {
    cursor: pointer;
    background: $blue;
    box-shadow: none;
    .kt-address-item__address {
      color: $white;
    }
  }
  .kt-address-item__address,
  .kt-address-item__balance-value,
  .kt-address-item__balance-currency {
    color: $white;
  }
}
</style>
