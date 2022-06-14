<template>
  <div class="kt-addresses-md">
    <span class="kt-addresses-md__title">
      KT <span>{{ $t('address') }}</span>
    </span>
    <div class="kt-addresses-md__list">
      <KtAddressItemMd
        :item="currentWallet"
        :current-wallet="currentWallet"
        :is-checked="!currentKtAddress"
        type="main"
        @click="updateCurrentKtAddress(null)"
      />
      <KtAddressItemMd
        v-for="(item, index) in ktAddresses"
        :key="`${index}-${item.address}`"
        :item="item"
        :current-wallet="currentWallet"
        :is-checked="isChecked(item)"
        @click="updateCurrentKtAddress(item)"
      />
    </div>
  </div>
</template>

<script>
import { inject } from '@vue/runtime-core';
import KtAddressItemMd from './components/KtAddressItemMd.vue';
export default {
  name: 'KtAddressesMd',
  components: { KtAddressItemMd },
  props: {
    currentWallet: {
      type: Object,
      default: ()=>{},
    },
  },
  setup() {
    const currentKtAddress = inject('currentKtAddress');
    const ktAddresses = inject('ktAddresses');
    const updateCurrentKtAddress = inject('updateCurrentKtAddress');
    const isChecked = (item)=> currentKtAddress?.value?.address?.toLowerCase() === item.address.toLowerCase();

    return { currentKtAddress, ktAddresses, updateCurrentKtAddress, isChecked };
  },
};
</script>

<style lang="scss" scoped>
.kt-addresses-md{
    width: 100%;
    display: flex;
    flex-direction: column;
    &__title,
    &__title > span{
        font-size: 14px;
        line-height: 17px;
        font-family: 'Panton_Bold';
        margin-bottom: 11px;
        & span{
            text-transform: lowercase;
            margin-bottom: 0;
        }
    }
    &__list{
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 185px;
    }

}
</style>
