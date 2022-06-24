<template>
  <div class="sidebar" :class="showClass">
    <div class="sidebar__logo">
      <div
        data-qa="main-logo"
        class="sidebar__logo-inner-wrapper"
        @click="setActiveTab('all')"
      >
        <citadelLogo class="sidebar__logo-citadel" />
        <onlyLogo class="sidebar__compact-logo-citadel" />
      </div>
    </div>

    <OverallCard
      :balance="totalBalanceWithSubtokensUSD"
      :cryptobalance="totalBTCBalance"
      :title="activeTab"
      @click="setActiveTab(activeTab)"
    />
    <div v-if="walletsList?.length > 0" class="sidebar__overall">
      <div class="sidebar__addresses-top">
        <div class="sidebar__addresses-header-compact">
          <h4 class="sidebar__addresses-header-title">
            {{ $t('layouts.addAddressLayout.wallets') }}
          </h4>
        </div>
        <div class="sidebar__addresses-header">
          <h4 class="sidebar__addresses-header-title">
            {{
              activeTab === 'all'
                ? $t('layouts.addAddressLayout.addresses')
                : activeTab
            }}
          </h4>
          <div class="sidebar__addresses-header-controls">
            <div
              class="sidebar__addresses-header-controls-serach-icon"
              :class="{ 'sidebar__active-icon': showSearchInput }"
              data-qa="sidebar__search-button"
              @click="toggleShowSearchInput(!showSearchInput)"
            >
              <loop />
            </div>
            <WalletFilterDropdown
              v-model:value="filterValue"
              relative-component="body"
              :top="width < 1280 ? '206' : '378'"
              :left="width < 1280 ? '158' : '210'"
              :items="filterList"
            />
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-if="showSearchInput" class="sidebar__addresses-search-input">
          <Input
            id="walletSearch"
            v-model="keyword"
            :label="$t('searchToken')"
            type="text"
            icon="loop"
            autofocus
            :placeholder="$t('inputToken')"
            background="#edf2fc"
            clearable
            data-qa="sidebar__search-field"
            @blur="blurHandrer(false)"
          />
        </div>
      </transition>

      <div v-if="!displayData.length" class="sidebar__addresses-addresses">
        <h4 class="sidebar__addresses-header-title">
          {{ $t('layouts.addAddressLayout.addresses') }}
        </h4>
        <SearchPlaceholder />
      </div>
      <div
        v-else
        class="sidebar__addresses-addresses"
        @scroll="onScrollContent"
      >
        <transition-group name="drop">
          <AddressItem
            v-for="wallet in displayData"
            :key="`${wallet.net}${wallet.address}`"
            :wallet="wallet"
          />
        </transition-group>
      </div>
    </div>
    <div v-if="walletsList?.length === 0" class="sidebar__address-placeholder">
      <AddressPlaceholder :active-tab="activeTab" />
    </div>
    <button
      class="sidebar__add-address-button"
      data-qa="sidebar__add-address-button"
      @click="toAddAddress"
    >
      <span class="sidebar__add-address-button-text">
        {{ $t('addAddressExp') }}
      </span>
      <div>+</div>
    </button>
    <button
      class="sidebar__compact-view-button"
      @click="sideBarView"
      :class="`${showClass}`"
    >
      <ArrowRight />
    </button>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useWindowSize } from 'vue-window-size';
import useWallets from '@/compositions/useWallets';
import { sortByAlphabet } from '@/helpers';

import WalletFilterDropdown from '@/components/UI/WalletFilterDropdown';
import Input from '@/components/UI/Input';
import SearchPlaceholder from './SearchPlaceholder.vue';
import AddressItem from './AddressItem';
import OverallCard from './OverallCard';
import AddressPlaceholder from './AddressPlaceholder';
import citadelLogo from '@/assets/icons/citadelLogo.svg';
import onlyLogo from '@/assets/icons/only-logo.svg';
import ArrowRight from '@/assets/icons/arrow-rigth.svg';

import loop from '@/assets/icons/input/loop.svg';

export default {
  name: 'Sidebar',
  components: {
    citadelLogo,
    AddressPlaceholder,
    OverallCard,
    AddressItem,
    loop,
    Input,
    SearchPlaceholder,
    WalletFilterDropdown,
    onlyLogo,
    ArrowRight,
  },

  emits: ['editList', 'createList'],
  setup(props, { emit }) {
    const keyword = ref('');
    const showSearchInput = ref(false);
    const filterList = ref([
      { icon: 'byAlphabet', value: 'byAlphabet' },
      { icon: 'byAlphabetReverse', value: 'byAlphabetReverse' },
      { icon: 'byValue', value: 'byValue' },
      { icon: 'byValueReverse', value: 'byValueReverse' },
    ]);
    const filterValue = ref(filterList.value[0].value);
    const { width } = useWindowSize();
    const store = useStore();
    const router = useRouter();
    const showClass = ref('');
    const toAddAddress = () => {
      router.push({ name: 'AddAddress' });
    };

    const { wallets } = useWallets();

    const currency = computed(() => store.getters['profile/info'].rates);

    const activeTab = computed(() => store.getters['wallets/activeList']);
    const customWalletsList = computed(
      () => store.getters['wallets/customWalletsList']
    );
    const setActiveTab = (list) => {
      store.commit('wallets/SET_ACTIVE_LIST', list);
      router.push({ name: 'Overall' });
    };

    const totalUSDBalance = computed(() => {
      const value = walletsList.value.reduce((total, currentValue) => {
        return BigNumber(total).plus(currentValue?.balanceUSD).toNumber();
      }, 0);

      store.dispatch('balance/setBalance', { type: 'usd', value });

      return value;
    });

    const subtokensBalanceUSD = computed(() => {
      return walletsList.value.reduce((total, currentValue) => {
        return BigNumber(total)
          .plus(currentValue.subtokenBalanceUSD || 0)
          .toNumber();
      }, 0);
    });

    const totalBalanceWithSubtokensUSD = computed(() => {
      const value = BigNumber(subtokensBalanceUSD.value)
        .plus(totalUSDBalance.value)
        .toNumber();

      store.dispatch('balance/setBalance', { type: 'usdWithTokens', value });

      return value;
    });
    const totalBTCBalance = computed(() => {
      const value = BigNumber(totalBalanceWithSubtokensUSD.value)
        .dividedBy(currency.value?.btc.USD)
        .toNumber();

      store.dispatch('balance/setBalance', { type: 'btc', value });

      return value;
    });

    const customList = computed(() => {
      if (customWalletsList.value.length > 0) {
        const customList = customWalletsList.value.find(
          (list) => list.name === activeTab.value
        );

        return (customList && customList.wallets) || [];
      }

      return [];
    });

    const walletsList = computed(() => {
      let customListWallets = [];

      if (activeTab.value === 'all') {
        return wallets.value;
      }

      for (const { net, address } of customList.value) {
        const walletsList = wallets.value.filter(
          (wallet) =>
            wallet.address.toLowerCase() === address.toLowerCase() &&
            wallet.net === net
        );
        customListWallets = customListWallets.concat(walletsList);
      }

      return customListWallets;
    });
    const filteredWallets = computed(() => {
      const data = walletsList.value;
      const byAlphabet = sortByAlphabet(data, 'title', 'address');
      const byValue = data.sort((a, b) => a.balanceUSD - b.balanceUSD);

      switch (filterValue.value) {
        case 'byAlphabet':
          return byAlphabet;
        case 'byAlphabetReverse':
          return byAlphabet.reverse();
        case 'byValue':
          return byValue;
        case 'byValueReverse':
          return byValue.reverse();
        default:
          return data;
      }
    });

    const displayData = computed(() => {
      if (!keyword.value) {
        return filteredWallets.value;
      }

      return filteredWallets.value.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
          item.code.toLowerCase().includes(keyword.value.toLowerCase()) ||
          item.address.toLowerCase().includes(keyword.value.toLowerCase())
      );
    });

    const showCustomLists = ref(false);
    const closeCustomListModal = () => {
      showCustomLists.value = false;
    };

    const editList = (value) => {
      showCustomLists.value = false;
      emit('editList', value);
    };

    const createList = () => {
      showCustomLists.value = false;
      emit('createList');
    };
    const walletsCustomLists = computed(() =>
      customWalletsList.value.filter((item) => item.name !== 'Favourites')
    );
    const toggleShowSearchInput = (value) => {
      showSearchInput.value = value;
      keyword.value = '';
    };
    const blurHandrer = async (value) => {
      setTimeout(() => {
        showSearchInput.value = value;
        keyword.value = '';
      }, 200);
    };

    showClass.value = window.innerWidth <= 1024 ? 'compact' : '';

    const sideBarView = () => {
      showClass.value = showClass.value == '' ? 'compact' : '';
    };

    const onScrollContent = (e) => {
      const { scrollTop, offsetHeight, scrollHeight } = e.target;
      if (scrollTop <= 15 || scrollTop == 0) {
        e.target.classList.add('top');
      } else if (scrollTop + offsetHeight >= scrollHeight) {
        e.target.classList.add('bottom');
      } else {
        e.target.classList.remove('top', 'bottom');
      }
    };
    return {
      activeTab,
      toAddAddress,
      walletsList,
      totalBTCBalance,
      totalBalanceWithSubtokensUSD,
      setActiveTab,
      showCustomLists,
      width,
      closeCustomListModal,
      editList,
      createList,
      walletsCustomLists,
      keyword,
      showSearchInput,
      displayData,
      filterValue,
      filterList,
      filteredWallets,
      toggleShowSearchInput,
      blurHandrer,
      showClass,
      sideBarView,
      onScrollContent,
    };
  },
};
</script>

<style lang="scss" scoped>
.active {
  background-image: $blue-gradient;
  box-shadow: 0 10px 15px 0 #50647c29, 0 15px 50px 0 #50647c1a;
}
.sidebar {
  max-width: $sidebar-max-width;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: $sidebar-padding;
  transition: all 0.25s;
  border-right: 1px solid transparent;

  @include md {
    padding: $sidebar-padding-md;
    max-width: $sidebar-max-width-md;
  }

  @include laptop {
    padding: $sidebar-padding-laptop;
    @include sidebar-compact-view;
  }

  &:hover {
    background-color: #fff;
    .sidebar__compact-view-button {
      opacity: 1;
    }
    .sidebar__add-address-button {
      border-style: solid;
      border-color: $too-ligth-blue;
    }
  }

  &__compact-view-button {
    background: $too-ligth-blue;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;

    position: absolute;
    top: 20%;
    right: -12px;

    opacity: 0;
    transition: 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;

    & svg {
      height: 10px;
      width: 5px;
      transform: rotate(180deg);
    }
    &:hover {
      background-color: $light-blue-1;
    }
  }

  &.compact {
    max-width: $sidebar-compact-max-width;
    background: $white;
  }

  &__compact-logo-citadel {
    display: none;
  }

  &.compact &__logo-citadel {
    display: none;
  }

  &.compact &__compact-logo-citadel {
    display: block;

    svg {
      height: 24px;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    margin-bottom: 43px;

    @include md {
      margin-bottom: 28px;
    }
  }

  &__logo-inner-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__overall {
    max-width: calc(#{$sidebar-max-width} - 50px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    width: 100%;
    margin: 0 auto 15px;
    position: relative;
  }

  &__addresses {
    max-width: calc(#{$sidebar-max-width} - 50px);
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    @include md {
      max-width: calc(#{$sidebar-max-width-md} - 50px);
    }
    &-top {
      background-color: $white;
      padding: 15px;
      border-radius: $card-border-radius;
      margin-bottom: 15px;
    }
  }

  &__addresses-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
  }

  &__addresses-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-compact {
      display: none;
      justify-content: center;
    }
  }

  &__addresses-header-title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 135px;

    @include lg {
      line-height: 24px;
    }

    @include md {
      max-width: 95px;
      font-size: 14px;
      line-height: 17px;
    }
  }

  &__addresses-header-controls {
    display: flex;
    align-items: center;
  }

  &__addresses-header-controls-search-icon {
    & svg {
      width: 20px;
      height: 20px;
      fill: $mid-blue;
      margin-right: 19px;
      cursor: pointer;

      @include md {
        width: 18px;
        height: 18px;
      }

      &:hover {
        fill: $blue;
      }
    }
  }

  &__active-icon {
    & svg {
      fill: $too-dark-blue;

      &:hover {
        fill: $too-dark-blue;
      }
    }
  }

  &__addresses-search-input {
    min-height: 68px;
    width: 221px;
    margin-bottom: 16px;

    @include md {
      width: 169px;
    }
  }

  &__addresses-addresses {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-grow: 1;
    position: relative;
    // padding: 0 15px;
    list-style-type: none;
    border: 1px solid $light-gray-1;
    border-radius: $card-border-radius;
    height: 100%;
    // box-shadow: 0 22px 22px -22px rgba(0, 0, 0, 0.8) inset,
    //   0 -22px 22px -22px rgba(0, 0, 0, 0.8) inset;
    &:hover {
      overflow-y: overlay;

      &:after,
      &:before {
        visibility: visible;
      }
      &.bottom:after,
      &.top:before {
        visibility: hidden;
      }
    }

    &:after,
    &:before {
      content: '';
      height: 15px;
      width: 100%;
      position: sticky;
      margin-top: 0;
      padding: 0;
      display: list-item;
      visibility: hidden;
    }

    &:after {
      bottom: 0;
      margin-top: auto;
      margin-bottom: -100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.2) 40%, transparent);
    }

    &:before {
      top: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.2) 40%,

        transparent
      );
      z-index: -1;
    }
  }

  &__address-placeholder {
    margin: 0 auto;
  }

  &__add-address-button {
    display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: calc(#{$sidebar-max-width} - 50px);
    max-height: 80px;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background: $white;
    @include title-default;
    font-size: $add-btn-font-size !important;
    margin-top: 15px;
    margin-bottom: 8px;
    border: 1px solid transparent;
    transition: 0.2s;
    @include md {
      max-width: calc(#{$sidebar-max-width-md} - 50px);
      height: 60px;
      border-radius: 8px;
    }

    &:hover {
      background: $dark-blue;
      color: $white;
      border-color: $too-ligth-blue;
      & div {
        background: $white;
        color: $dark-blue;
        box-shadow: 0px 4px 20px rgba(105, 95, 225, 0.7);
      }
    }

    & div {
      width: 48px;
      height: 48px;
      border-radius: $round;
      background: $dark-blue;
      font-size: 24px;
      color: $white;
      display: flex;
      justify-content: center;
      align-items: center;

      @include md {
        width: 32px;
        height: 32px;
        font-size: 18px;
      }
    }
  }
}

@include sidebar-compact-view;

.drop-enter-active,
.drop-leave-active {
  transition: all 0.7s ease;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
