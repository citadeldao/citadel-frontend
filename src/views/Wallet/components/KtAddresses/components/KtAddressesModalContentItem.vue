<template>
  <div
    class="kt-addresses-modal-content-item"
    :class="{main: type === 'main', isChecked}"
  >
    <span class="kt-addresses-modal-content-item__parent-address">
      {{ item.title || item.address }}
    </span>
    <div class="kt-addresses-modal-content-item__info">
      <span
        ref="address"
        class="kt-addresses-modal-content-item__address"
      >
        <resize-observer
          :show-trigger="true"
          @notify="handleResize"
        />
        {{ formatedAddress }}
      </span>
      <div class="kt-addresses-modal-content-item__balance">
        <span
          v-pretty-number="{ value: item.balance.calculatedBalance, currency: currentWallet.code }"
          class="kt-addresses-modal-content-item__balance-value"
        />
        <span class="kt-addresses-modal-content-item__balance-currency">
          {{ currentWallet.code }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { formattedWalletAddress } from '@/helpers';
export default {
  name:'KtAddressesModalContentItem',
  props:{
    item:{
      type: Object,
      default: ()=>{},
    },
    currentWallet: {
      type: Object,
      default:()=>{},
    },
    type:{
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
      formattedWalletAddress(
        props.item.address,
        224,
        'Panton_SemiBold',
        14,
      ),
    );

    return{ address, wrapperWidth, handleResize, formatedAddress };
  },
};
</script>

<style lang="scss" scoped>
.kt-addresses-modal-content-item{
    width: 100%;
    min-height: 64px;
    border-radius: 8px;
    padding: 11px 16px 0 16px;
    display: flex;
    flex-direction: column;
    background: $info-block-bg-with-op;
    margin-bottom: 8px;
    border: 1px solid transparent;
    &:last-child{
      margin-bottom: 0;
    }
    &:hover{
      cursor: pointer;
      background: $white;
      border: 1px solid $info-block-bg-with-op;
      .kt-addresses-modal-content-item__address{
        color: $blue;
      }
    }
    &__parent-address{
        font-size: 16px;
        line-height: 19px;
        color: $too-dark-blue;
    }
    &__info{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &__address{
        display: flex;
        font-size: 14px;
        line-height: 17px;
        position: relative;
        max-width: 255px;
        margin-bottom: 6px;
        color: $blue;
    }
    &__balance{
      display: flex;
      align-items: baseline;
    }
    &__balance-value,
    &__balance-currency{
      font-size: 14px;
      line-height: 17px;
      color: $dark-blue;
    }
    &__balance-value{
      font-family: 'Panton_Bold'!important;
      color: $too-dark-blue;
      margin-right: 3px;
    }
}
.main{
  background: $dark-blue-with-op;
  .kt-addresses-modal-content-item__address{
    color: $dark-blue;
  }
}
.isChecked{
  background: $blue;
   &:hover{
      cursor: pointer;
      background: $blue;
      box-shadow: none;
      .kt-addresses-modal-content-item__address{
        color: $white;
      }
   }
   .kt-addresses-modal-content-item__address,
   .kt-addresses-modal-content-item__balance-value,
   .kt-addresses-modal-content-item__balance-currency,
   .kt-addresses-modal-content-item__parent-address{
    color: $white
  }
}
</style>
