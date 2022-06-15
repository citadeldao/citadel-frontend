<template>
  <div class="kt-dddress-item-md" :class="{ main: type === 'main', isChecked }">
    <span ref="address" class="kt-dddress-item-md__address">
      <resize-observer :show-trigger="true" @notify="handleResize" />
      {{ formatedAddress }}
    </span>
    <div class="kt-dddress-item-md__balance">
      <span
        v-pretty-number="{
          value: item.balance.calculatedBalance,
          currency: currentWallet.code,
        }"
        class="kt-dddress-item-md__balance-value"
      />
      <span class="kt-dddress-item-md__balance-currency">
        {{ currentWallet.code }}
      </span>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { formattedWalletAddress } from '@/helpers';
export default {
  name: 'KtAddressItemMd',
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
    const address = ref(null);
    const wrapperWidth = ref();
    const handleResize = ({ width }) => {
      wrapperWidth.value = width;
    };

    const formatedAddress = computed(() =>
      formattedWalletAddress(props.item.address, 85, 'Panton_SemiBold', 14)
    );

    return { address, wrapperWidth, handleResize, formatedAddress };
  },
};
</script>

<style lang="scss" scoped>
.kt-dddress-item-md {
  width: 100%;
  min-height: 56px;
  border-radius: 8px;
  padding: 10px 0 0 19px;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  background: $info-block-bg-with-op;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    cursor: pointer;
    background: $white;
    .kt-dddress-item-md__address {
      color: $blue;
    }
  }
  &__address {
    display: flex;
    font-size: 14px;
    line-height: 17px;
    position: relative;
    max-width: 85px;
    margin-bottom: 4px;
    color: $blue;
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
  .kt-dddress-item-md__address {
    color: $dark-blue;
  }
}
.isChecked {
  background: $blue;
  &:hover {
    cursor: pointer;
    background: $blue;
    box-shadow: none;
    .kt-dddress-item-md__address {
      color: $white;
    }
  }
  .kt-dddress-item-md__address,
  .kt-dddress-item-md__balance-value,
  .kt-dddress-item-md__balance-currency {
    color: $white;
  }
}
</style>
