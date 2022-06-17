<template>
  <div class="addressPlaceholder">
    <walletAddress v-if="activeTab == 'all'" />
    <favoritePlaceholder v-if="activeTab == 'Favourites'" />
    <span v-if="activeTab == 'all'">
      {{ $t('layouts.addAddressLayout.sidebarPlaceholder') }}
    </span>
    <span v-if="activeTab == 'Favourites'">
      {{ $t('layouts.addAddressLayout.favoritePlaceholder') }}
    </span>
  </div>
</template>

<script>
import favoritePlaceholder from '@/assets/icons/favorite-placeholder.svg';
import walletAddress from '@/assets/icons/wallet-address.svg';
export default {
  name: 'AddressPlaceholder',
  components: { walletAddress, favoritePlaceholder },
  props: {
    activeTab: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.addressPlaceholder {
  width: 221px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #c3ceeb;
  border-radius: 25px;
  padding: 58px 19px 52px 19px;
  @include md {
    width: 167px;
    padding: 28px 8px 41px 8px;
    border-radius: 8px;
  }
  & svg {
    margin-bottom: 16px;
  }
  & span {
    font-family: 'Panton_Light';
    font-size: 18px;
    line-height: 24px;
    color: $too-ligth-blue;
    text-align: center;
    @include md {
      font-size: 16px;
    }
  }
}
</style>
