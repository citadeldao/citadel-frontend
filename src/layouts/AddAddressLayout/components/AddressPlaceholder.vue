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
  max-width: calc(#{$sidebar-max-width} - 50px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #c3ceeb;
  border-radius: 16px;
  padding: 35px 5px;
  margin: 0 auto;
  & svg {
    margin-bottom: 16px;
  }
  & span {
    font-family: 'Panton_Light';
    font-size: 18px;
    color: $too-ligth-blue;
    text-align: center;
    line-height: 1.5;
    @include md {
      font-size: 16px;
      max-width: calc(#{$sidebar-max-width-md} - 50px);
    }
  }
}
.compact .addressPlaceholder {
  display: none;

  & svg {
    display: none;
  }
  & span {
    display: none;
  }
}
</style>
